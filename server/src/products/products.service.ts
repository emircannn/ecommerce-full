import { BadRequestException, Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  generateBarcode,
  generateSeo,
  generateStockCode,
  generateVariants,
  successReturn,
} from 'utils/helpers';
import { In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Manufacturer } from 'src/manufacturers/entities/manufacturer.entity';
import { Category } from 'src/categories/entities/category.entity';
import {
  Combinations,
  Variant,
  VariantValue,
} from 'src/variations/entities/variation.entity';
import { GetProductsDto } from './dto/getProducts.entity';
import { UpdateProductStatusDto } from './dto/update-product.dto';
import { promisify } from 'util';
import { unlink } from 'fs';

const unlinkAsync = promisify(unlink);

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Combinations)
    private readonly combinationsRepository: Repository<Combinations>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(VariantValue)
    private readonly variantValueRepository: Repository<VariantValue>,
  ) {}

  //*Olustur
  async create(
    dto: CreateProductDto,
    imagePath: string | null,
    imagePaths: string[],
  ) {
    // Kategoriyi bulma
    const category = await this.categoryRepository.findOne({
      where: { id: dto.category },
    });

    if (!category) {
      throw new BadRequestException(
        'Geçersiz kategori ID’si. Lütfen geçerli bir kategori seçin.',
      );
    }

    // Üreticiyi bulma (opsiyonel)
    const manufacturer = dto.manufacturer
      ? await this.manufacturerRepository.findOne({
          where: { id: dto.manufacturer },
        })
      : null;

    // SEO oluşturma
    const seo = await generateSeo(dto.name, this.productRepository);

    // İndirim oranını hesaplama
    const discount_rate =
      dto.special && dto.special < dto.price
        ? ((dto.price - dto.special) / dto.price) * 100
        : null;

    // JSON verilerini parse etme
    const combinations = dto.combinations ? JSON.parse(dto.combinations) : [];
    const variants = generateVariants(combinations);

    // Ürünü oluşturma
    const newProduct = this.productRepository.create({
      ...dto,
      seo,
      special: dto.special ? dto.special : null,
      discount_rate,
      image: imagePath,
      images: imagePaths,
      manufacturer,
      category,
    });

    // Ürünü veritabanına kaydetme
    await this.productRepository.save(newProduct);

    // Varyantları ve varyant değerlerini oluşturma
    if (variants.length > 0) {
      for (const variant of variants) {
        const newVariant = this.variantRepository.create({
          name: variant.name,
          product: newProduct,
        });
        await this.variantRepository.save(newVariant);

        for (const value of variant.values) {
          const newValue = this.variantValueRepository.create({
            value: value.value,
            variant: newVariant,
            id: value.id,
            combinations: [],
          });
          await this.variantValueRepository.save(newValue);
        }
      }
    }

    const currentProductVariants = await this.productRepository.findOne({
      where: { id: newProduct.id },
      relations: ['variants'],
      select: ['variants', 'id'],
    });

    // Kombinasyonları oluşturma
    if (combinations.length > 0) {
      for (const combination of combinations) {
        const special = parseFloat(combination.special);
        const price = parseFloat(combination.price);
        const discount_rate =
          special && special < price ? ((price - special) / price) * 100 : null;

        const newCombination = this.combinationsRepository.create({
          sku: combination.sku,
          stock: parseInt(combination.stock),
          price,
          special: combination.special ? parseFloat(combination.special) : null,
          weight: combination.weight ? parseInt(combination.weight) : null,
          discount_rate: discount_rate,
          variant_values: combination.variant_values,
          barcode: combination.barcode,
          product: newProduct,
        });
        await this.combinationsRepository.save(newCombination);

        for (const variantValue of newCombination.variant_values) {
          const variantValueEntity = await this.variantValueRepository.findOne({
            where: {
              id: variantValue.id,
              variant: In(currentProductVariants.variants.map(v => v.id)),
            },
          });

          if (variantValueEntity) {
            variantValueEntity.combinations.push(newCombination.id.toString());
            await this.variantValueRepository.save(variantValueEntity);
          }
        }
      }
    }

    return successReturn({ message: 'Ürün başarıyla oluşturuldu.' });
  }

  //! urun silme
  async deleteProducts(ids: number[]) {
    const products = await this.productRepository.findBy({
      id: In(ids),
    });

    for (const product of products) {
      // Resim dosyalarını silme işlemi
      if (product.image) {
        try {
          await unlinkAsync(product.image);
          console.log(`Resim başarıyla silindi: ${product.image}`);
        } catch (err) {
          console.error('Resim silinirken bir hata oluştu:', err);
        }
      }

      if (product.images && product.images.length > 0) {
        for (const img of product.images) {
          try {
            await unlinkAsync(img);
            console.log(`Resim başarıyla silindi: ${img}`);
          } catch (err) {
            console.error('Resim silinirken bir hata oluştu:', err);
          }
        }
      }

      // Ürünü veritabanından silme işlemi
      await this.productRepository.remove(product);
    }

    console.log(`${products.length} ürün başarıyla silindi.`);

    return successReturn({ message: 'Ürün(ler) başarıyla silindi.' });
  }

  //* Admin Urun Listesi
  async getAdminProductList(dto: GetProductsDto) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder.leftJoinAndSelect('product.category', 'category');
    queryBuilder.select([
      'product.id',
      'product.image',
      'product.sku',
      'product.name',
      'product.barcode',
      'product.stock',
      'product.is_active',
      'product.price',
      'product.special',
      'product.weight',
      'product.createdAt',
      'category.name',
    ]);

    // Filtering
    if (dto.name) {
      queryBuilder.andWhere('product.name LIKE :name', {
        name: `%${dto.name}%`,
      });
    }

    if (dto.categoryIds && dto.categoryIds.length > 0) {
      queryBuilder.andWhere('product.category IN (:...categoryIds)', {
        categoryIds: dto.categoryIds,
      });
    }

    if (dto.manufacturerIds && dto.manufacturerIds.length > 0) {
      queryBuilder.andWhere('product.manufacturer IN (:...manufacturerIds)', {
        manufacturerIds: dto.manufacturerIds,
      });
    }

    if (dto.barcode) {
      queryBuilder.andWhere('product.barcode = :barcode', {
        barcode: dto.barcode,
      });
    }

    if (dto.sku) {
      queryBuilder.andWhere('product.sku = :sku', { sku: dto.sku });
    }

    if (dto.hasImage !== undefined) {
      if (dto.hasImage === 'true') {
        queryBuilder.andWhere('product.image IS NOT NULL');
      } else {
        queryBuilder.andWhere('product.image IS NULL');
      }
    }

    if (dto.isActive !== undefined) {
      queryBuilder.andWhere('product.is_active = :is_active', {
        is_active: dto.isActive === 'true' ? true : false,
      });
    }

    // Sorting
    if (dto.sortField) {
      queryBuilder.orderBy(`product.${dto.sortField}`, dto.sortBy || 'ASC');
    } else {
      queryBuilder.orderBy('product.createdAt', 'DESC');
    }

    // Pagination
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;
    const take = limit;

    queryBuilder.skip(skip).take(take);

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      data: products,
      total,
      totalPages: Math.ceil(total / limit),
      limit,
    };
  }

  //* Durum Guncellemesi
  async updateProductStatus(dto: UpdateProductStatusDto) {
    await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ is_active: dto.isActive })
      .whereInIds(dto.productIds)
      .execute();

    return successReturn({ message: 'Ürünler başarıyla güncellendi' });
  }

  //*BARKOD
  async generateUniqueBarcode() {
    let barcode;
    let isUnique = false;

    while (!isUnique) {
      barcode = generateBarcode();
      const existingCode = await this.productRepository.findOne({
        where: { barcode },
      });
      if (!existingCode) {
        isUnique = true;
      }
    }

    return { barcode };
  }

  //*SKU
  async generateUniqueSKU() {
    let sku;
    let isUnique = false;

    while (!isUnique) {
      sku = generateStockCode();
      const existingCode = await this.productRepository.findOne({
        where: { sku },
      });
      if (!existingCode) {
        isUnique = true;
      }
    }

    return { sku };
  }
}
