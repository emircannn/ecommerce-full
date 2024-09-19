import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { FiltersService } from 'src/filters/filters.service';
import { Product } from 'src/products/entities/product.entity';
import { Combinations } from 'src/variations/entities/variation.entity';
import { Repository } from 'typeorm';
import {
  GetCategoryProducts,
  GetManufacturerProducts,
} from './dto/create-home.dto';
import { Manufacturer } from 'src/manufacturers/entities/manufacturer.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Combinations)
    private readonly combinationsRepository: Repository<Combinations>,
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    private readonly filterServices: FiltersService,
  ) {}

  //* Ana Sayfa Kategori Listesi
  async getHomeList() {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.home_sub', 'home_sub')
      .where('category.show_home = :showHome', { showHome: true })
      .andWhere('category.home_parent IS NULL')
      .select([
        'category.name',
        'category.seo',
        'category.image',
        'home_sub.name',
        'home_sub.seo',
        'home_sub.image',
      ])
      .getMany();

    return categories;
  }

  async getProductList() {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.reviews', 'reviews') // Sadece reviews ile join yapıyoruz, select etmiyoruz
      .select([
        'product.id',
        'product.name',
        'product.seo',
        'product.price',
        'product.special',
        'product.createdAt',
        'product.image',
        'product.images',
        'product.discount_rate',
        'product.rating',
      ])
      .addSelect('COALESCE(COUNT(reviews.id), 0)', 'rate_count') // NULL olanları 0 yapıyoruz
      .where('product.is_active = :isActive', { isActive: true })
      .groupBy('product.id') // Ürün bazında gruplama yapıyoruz
      .getRawMany(); // Veriyi ham olarak çekiyoruz, bu sayede ek alanları alabiliriz

    return products.map(product => ({
      id: product.product_id,
      name: product.product_name,
      seo: product.product_seo,
      price: product.product_price,
      special: product.product_special,
      createdAt: product.product_createdAt,
      image: product.product_image,
      images: product.product_images,
      discount_rate: product.product_discount_rate,
      rating: product.product_rating,
      rate_count: parseInt(product.rate_count, 10),
    }));
  }

  async getProductWithSeo(seo: string) {
    // Ürünü ve ilişkili verileri al, sadece gerekli alanları seç
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('variants.values', 'variant_values')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.manufacturer', 'manufacturer')
      .leftJoinAndSelect(
        subQuery =>
          subQuery
            .select('product.id', 'product_id')
            .addSelect('COALESCE(COUNT(reviews.id), 0)', 'rate_count')
            .from('product', 'product')
            .leftJoin('product.reviews', 'reviews')
            .groupBy('product.id'),
        'productReviewCount',
        'product.id = productReviewCount.product_id',
      )
      .where('product.seo = :seo', { seo })
      .getOne();

    if (!product) {
      throw new NotFoundException('Ürün bulunamadı');
    }

    const selectedCombination = await this.combinationsRepository
      .createQueryBuilder('combinations')
      .where('combinations.productId = :productId', { productId: product.id })
      .orderBy('combinations.id', 'ASC') // İlk kombinasyonu almak için sıralama
      .limit(1) // Yalnızca ilk kombinasyonu yükle
      .getOne();

    // View count artır
    product.view_count = (product.view_count || 0) + 1;
    await this.productRepository.save(product);

    // Kategori ve markayı sadece seo ve name ile yeniden oluştur
    const category = product.category
      ? {
          seo: product.category.seo,
          name: product.category.name,
        }
      : null;

    const manufacturer = product.manufacturer
      ? {
          seo: product.manufacturer.seo,
          name: product.manufacturer.name,
        }
      : null;

    // Kategori breadcrumb oluştur
    const breadcrumbs = await this.filterServices.createBreadcrumbs(
      category?.seo,
    );

    if (product.variants) {
      product.variants.forEach(variant => {
        if (variant.values) {
          variant.values.sort((a, b) => a.id - b.id);
        }
      });
    }

    return {
      product: {
        ...product,
        category,
        manufacturer,
        rate_count: product['productReviewCount_rate_count']
          ? parseInt(product['productReviewCount_rate_count'], 10)
          : 0,
        selectedVariant: selectedCombination || null,
      },
      breadcrumbs,
    };
  }

  async getProductsCategoryPage(
    filters: GetCategoryProducts = {} as GetCategoryProducts,
  ) {
    const categoryIds = filters.categoryIds || [];

    let categories: Category[] = [];

    if (categoryIds.length === 0) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { seo: filters.categorySeo },
      });

      if (!parentCategory) {
        throw new NotFoundException('Kategori Bulunamadı!');
      }

      categories =
        await this.filterServices.getAllCategoriesIncludingSubcategories([
          parentCategory.id,
        ]);
    } else {
      categories =
        await this.filterServices.getAllCategoriesIncludingSubcategories(
          categoryIds,
        );
    }

    const categoryIdsToUse = categories.map(category => category.id);

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.is_active = :isActive', { isActive: true })
      .andWhere('product.category IN (:...categoryIds)', {
        categoryIds: categoryIdsToUse,
      });
    queryBuilder.leftJoinAndSelect('product.category', 'category');
    queryBuilder.select([
      'product.id',
      'product.image',
      'product.name',
      'product.is_active',
      'product.price',
      'product.special',
      'product.createdAt',
      'product.manufacturer',
      'product.images',
      'product.view_count',
      'product.discount_rate',
      'product.seo',
    ]);

    // Üreticiye göre filtreleme
    if (filters.manufacturerIds && filters.manufacturerIds.length > 0) {
      queryBuilder.andWhere('product.manufacturer IN (:...manufacturerIds)', {
        manufacturerIds: filters.manufacturerIds,
      });
    }

    // Rating'e göre filtreleme
    if (filters.rating) {
      queryBuilder.andWhere('product.rating >= :rating', {
        rating: filters.rating,
      });
    }

    // Sıralama
    if (filters.sortField) {
      queryBuilder.orderBy(`product.${filters.sortField}`, filters.sortBy);
    } else {
      queryBuilder.orderBy('product.view_count', 'DESC'); // Default olarak view_count'e göre sırala
    }

    // Limit
    if (filters.limit) {
      queryBuilder.limit(filters.limit);
    }

    const page = filters.page ? Math.max(filters.page, 1) : 1;
    const limit = filters.limit ? Math.max(filters.limit, 1) : 20;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      total,
      totalPages: Math.ceil(total / limit),
      limit,
    };
  }

  async getProductsByBrand(
    filters: GetManufacturerProducts = {} as GetManufacturerProducts,
  ) {
    // Markayı SEO'ya göre bul
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { seo: filters.manufacturerSeo },
    });

    if (!manufacturer) {
      throw new NotFoundException('Marka Bulunamadı!');
    }

    // Ürün sorgusunu oluştur
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.is_active = :isActive', { isActive: true })
      .andWhere('product.manufacturer = :manufacturerId', {
        manufacturerId: manufacturer.id,
      });

    // Kategori ID'lerine göre filtreleme yap
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      queryBuilder.andWhere('product.category IN (:...categoryIds)', {
        categoryIds: filters.categoryIds,
      });
    }

    queryBuilder.leftJoinAndSelect('product.category', 'category');
    queryBuilder.select([
      'product.id',
      'product.image',
      'product.name',
      'product.is_active',
      'product.price',
      'product.special',
      'product.createdAt',
      'product.manufacturer',
      'product.images',
      'product.view_count',
      'product.discount_rate',
      'product.seo',
    ]);

    // Rating'e göre filtreleme
    if (filters.rating) {
      queryBuilder.andWhere('product.rating >= :rating', {
        rating: filters.rating,
      });
    }

    // Sıralama
    if (filters.sortField) {
      queryBuilder.orderBy(`product.${filters.sortField}`, filters.sortBy);
    } else {
      queryBuilder.orderBy('product.view_count', 'DESC'); // Varsayılan sıralama view_count'a göre
    }

    // Sayfalama
    const page = filters.page ? Math.max(filters.page, 1) : 1;
    const limit = filters.limit ? Math.max(filters.limit, 1) : 20;
    const skip = (page - 1) * limit;

    queryBuilder.skip(skip).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      total,
      totalPages: Math.ceil(total / limit),
      limit,
    };
  }
}
