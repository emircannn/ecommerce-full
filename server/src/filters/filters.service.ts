import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Manufacturer } from 'src/manufacturers/entities/manufacturer.entity';
import { Product } from 'src/products/entities/product.entity';
import { In, Repository } from 'typeorm';
import { OrderStatus } from './entities/filter.entity';

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    @InjectRepository(OrderStatus)
    private readonly statusRepository: Repository<OrderStatus>,
  ) {}

  async getCategoryFilter(seo: string): Promise<any> {
    const category = await this.categoryRepository.findOne({
      where: { seo },
      relations: ['parent', 'sub_categories'],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Breadcrumbs
    const breadcrumbs = await this.createBreadcrumbs(seo);

    // Alt kategorileri al
    const allCategories = await this.getAllCategoriesIncludingSubcategories([
      category.id,
    ]);

    // Ürünleri al
    const products = await this.productRepository.find({
      where: { category: In(allCategories.map(c => c.id)), is_active: true },
      relations: ['manufacturer'],
    });

    // Üreticileri listele
    const manufacturers = products
      .map(product => product.manufacturer)
      .filter(
        (manufacturer, index, self) =>
          manufacturer !== null && self.indexOf(manufacturer) === index,
      );

    return {
      breadcrumbs,
      subCategories: category.sub_categories,
      manufacturers,
    };
  }

  // Rekürsif olarak alt kategorileri al
  async getAllCategoriesIncludingSubcategories(
    parentIds: number[],
    visited: Set<number> = new Set(),
  ): Promise<Category[] | []> {
    let allCategories: Category[] = [];

    for (const parentId of parentIds) {
      // Eğer bu kategori zaten ziyaret edildiyse, atla
      if (visited.has(parentId)) {
        continue;
      }

      // Parent kategoriyi ekle
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: parentId },
      });

      if (parentCategory) {
        allCategories.push(parentCategory);
        visited.add(parentId);
      }

      // ParentId'ye sahip tüm alt kategorileri al
      const categories = await this.categoryRepository.find({
        where: { parent: { id: parentId } },
      });

      // Alt kategorileri işle
      const subCategories = await this.getAllCategoriesIncludingSubcategories(
        categories.map(category => category.id),
        visited,
      );

      allCategories = [...allCategories, ...subCategories];
    }

    return allCategories;
  }

  // Kategori ve parent'ları kullanarak breadcrumb oluşturma
  async createBreadcrumbs(seo: string) {
    const breadcrumbs = [];
    let currentCategorySeo = seo;

    while (currentCategorySeo) {
      const category = await this.categoryRepository.findOne({
        where: { seo: currentCategorySeo },
        relations: ['parent'],
      });

      if (category) {
        breadcrumbs.unshift({
          name: category.name,
          link: `/kategori/${category.seo}`,
        });
        currentCategorySeo = category.parent ? category.parent.seo : null;
      } else {
        break;
      }
    }

    return breadcrumbs;
  }

  //Marka
  async getBrandFilter(seo: string): Promise<any> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { seo },
    });

    if (!manufacturer) {
      throw new NotFoundException('Marka Bulunamadı!');
    }

    // Ürünleri al
    const products = await this.productRepository.find({
      where: { manufacturer: { id: manufacturer.id }, is_active: true },
      relations: ['category'],
      select: ['category', 'id', 'is_active'],
    });

    // Kategorileri listele
    const categories = products
      .map(product => product.category)
      .filter(
        (category, index, self) =>
          category !== null && self.indexOf(category) === index,
      );

    return {
      manufacturer,
      categories,
      total_products: products.length,
    };
  }

  //* Status
  async getStatus() {
    return await this.statusRepository.find();
  }
}
