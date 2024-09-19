import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCategoryDto,
  GetCategoriesDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { In, IsNull, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { errorReturn, generateSeo, successReturn } from 'utils/helpers';
import { unlink } from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(unlink);

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  //* Olusturma
  async create(dto: CreateCategoryDto, image: string | null) {
    let parentCategory = null;
    let homeParent = null;
    if (dto.parentId) {
      parentCategory = await this.categoryRepository.findOne({
        where: { id: dto.parentId },
      });
    }
    if (dto.homeParent) {
      homeParent = await this.categoryRepository.findOne({
        where: { id: dto.homeParent },
      });
    }
    const seo = await generateSeo(dto.name, this.categoryRepository);

    const newCategory = this.categoryRepository.create({
      ...dto,
      seo,
      image,
      parent: parentCategory,
      show_home: dto.show_home === 1 ? true : false,
      home_parent: homeParent,
    });

    await this.categoryRepository.save(newCategory);

    return successReturn({ message: 'Kategori başarıyla oluşturuldu.' });
  }

  //* Guncelle
  async update(dto: UpdateCategoryDto, image: string | null) {
    const isExist = await this.categoryRepository.findOne({
      where: { id: dto.id },
    });

    if (!isExist) {
      throw new BadRequestException('Böyle bir kategori bulunamadı.');
    }

    let parentCategory = null;
    if (dto.parentId) {
      parentCategory = await this.categoryRepository.findOne({
        where: { id: dto.parentId },
      });
    }

    let homeParent = null;
    if (dto.homeParent) {
      homeParent = await this.categoryRepository.findOne({
        where: { id: dto.homeParent },
      });
    }

    if (image) {
      unlink(`${isExist.image}`, err => {
        if (err) {
          console.error('Dosya silinirken bir hata oluştu:', err);
          return errorReturn('Lütfen tekrar deneyin.');
        }
        console.log('Dosya başarıyla silindi');
      });
    }

    const seo =
      dto.name && dto.name !== isExist.name
        ? await generateSeo(dto.name, this.categoryRepository)
        : isExist.seo;

    await this.categoryRepository.update(isExist.id, {
      name: dto.name ? dto.name : isExist.name,
      seo,
      image: image ? image : isExist.image,
      parent: parentCategory,
      show_home: dto.show_home === 1 ? true : false,
      home_parent: homeParent,
    });

    return successReturn({
      message: 'Kategori Başarıyla Güncellendi.',
    });
  }

  //* Admin Panel Listesi
  async getCategoryList(dto: GetCategoriesDto) {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    queryBuilder
      .leftJoin('category.parent', 'parent')
      .leftJoin('category.home_parent', 'home_parent')
      .addSelect([
        'parent.name',
        'parent.id',
        'home_parent.name',
        'home_parent.id',
      ]);

    // Filtering
    if (dto.name) {
      queryBuilder.andWhere('category.name LIKE :name', {
        name: `%${dto.name}%`,
      });
    }

    if (dto.hasImage !== undefined) {
      if (dto.hasImage === 'true') {
        queryBuilder.andWhere('category.image IS NOT NULL');
      } else {
        queryBuilder.andWhere('category.image IS NULL');
      }
    }

    if (dto.showHome !== undefined) {
      if (dto.showHome === 'true') {
        queryBuilder.andWhere('category.show_home = :showHome', {
          showHome: true,
        });
      } else if (dto.showHome === 'false') {
        queryBuilder.andWhere('category.show_home = :showHome', {
          showHome: false,
        });
      }
    }

    // Pagination
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;
    const take = limit;

    queryBuilder.skip(skip).take(take);

    queryBuilder.orderBy('category.createdAt', 'ASC');

    // Get categories
    const [categories, total] = await queryBuilder.getManyAndCount();

    return {
      data: categories,
      total,
      totalPages: Math.ceil(total / limit),
      limit,
    };
  }

  //! Silme
  async delete(categoryIds: number[]) {
    if (categoryIds.length === 0) {
      throw new NotFoundException("Silinecek kategori ID'leri belirtilmemiş.");
    }

    const categories = await this.categoryRepository.findBy({
      id: In(categoryIds),
    });

    if (!categories.length) {
      throw new NotFoundException('Silinecek kategori(ler) bulunamadı.');
    }

    // Resimleri sil
    for (const category of categories) {
      if (category.image) {
        try {
          await unlinkAsync(category.image);
          console.log(`Resim başarıyla silindi: ${category.image}`);
        } catch (err) {
          console.error('Resim silinirken bir hata oluştu:', err);
        }
      }
    }

    const result = await this.categoryRepository.delete(categoryIds);

    if (result.affected === 0) {
      throw new NotFoundException('Silinecek kategori(ler) bulunamadı.');
    }

    return successReturn({ message: 'Kategori(ler) başarıyla silindi.' });
  }

  async getCategoryTree(name: string): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      relations: ['parent'],
      select: ['parent', 'id', 'name'],
      where: { name: Like(`%${name}%`) },
    });

    if (name) {
      return categories;
    }

    return this.buildCategoryTree(categories);
  }

  //* Category Tree
  buildCategoryTree(
    categories: Category[],
    parentId: number | null = null,
  ): any[] {
    return categories
      .filter(
        category => (category.parent ? category.parent.id : null) === parentId,
      )
      .map(category => {
        delete category.createdAt;
        delete category.updatedAt;
        delete category.parent;
        return {
          ...category,
          sub_categories: this.buildCategoryTree(categories, category.id),
        };
      });
  }

  //* Admin Panel Select
  async getSelectCategory(query: {
    name?: string;
    page?: string;
    limit?: string;
    show?: string;
  }) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 50;
    const skip = (page - 1) * limit;

    const whereConditions: any = {};

    if (query.name) {
      whereConditions.name = Like(`%${query.name}%`);
    }

    if (query.show !== undefined) {
      whereConditions.show_home = query.show === '0' ? false : true;

      if (query.show === '1') {
        whereConditions.home_parent = IsNull(); // IsNull() kullanarak home_parent'i null olarak kontrol ediyoruz
      }
    }

    const categories = await this.categoryRepository.find({
      select: ['id', 'name'],
      where: whereConditions,
      take: limit,
      skip,
    });

    return categories;
  }
}
