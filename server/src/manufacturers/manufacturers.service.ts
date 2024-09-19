import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from './entities/manufacturer.entity';
import { In, Like, Repository } from 'typeorm';
import { ManufacturerDto, ManufacturerUpdateDto } from './dto/manufacturer.dto';
import { errorReturn, generateSeo, successReturn } from 'utils/helpers';
import { unlink } from 'fs';
import { promisify } from 'util';
import { GetProductsDto } from 'src/products/dto/getProducts.entity';

const unlinkAsync = promisify(unlink);

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
  ) {}

  //* Olusturma
  async create(dto: ManufacturerDto, image: string | null) {
    const seo = await generateSeo(dto.name, this.manufacturerRepository);

    const newCategory = this.manufacturerRepository.create({
      ...dto,
      seo,
      image,
    });

    await this.manufacturerRepository.save(newCategory);

    return successReturn({
      message: 'Marka Başarıyla Oluşturuldu.',
    });
  }

  //* Guncelle
  async update(dto: ManufacturerUpdateDto, image: string | null) {
    const isExist = await this.manufacturerRepository.findOne({
      where: { id: dto.id },
    });

    if (!isExist) {
      throw new BadRequestException('Böyle bir marka bulunamadı.');
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
        ? await generateSeo(dto.name, this.manufacturerRepository)
        : isExist.seo;

    await this.manufacturerRepository.update(isExist.id, {
      name: dto.name ? dto.name : isExist.name,
      seo,
      image: image ? image : isExist.image,
    });

    return successReturn({
      message: 'Marka Başarıyla Güncellendi.',
    });
  }

  //* Admin Panel Listesi
  async getAdminProductList(dto: GetProductsDto) {
    const queryBuilder =
      this.manufacturerRepository.createQueryBuilder('manufacturer');
    queryBuilder.select([
      'manufacturer.id',
      'manufacturer.image',
      'manufacturer.name',
      'manufacturer.createdAt',
    ]);

    // Filtering
    if (dto.name) {
      queryBuilder.andWhere('manufacturer.name LIKE :name', {
        name: `%${dto.name}%`,
      });
    }

    if (dto.hasImage !== undefined) {
      if (dto.hasImage === 'true') {
        queryBuilder.andWhere('manufacturer.image IS NOT NULL');
      } else {
        queryBuilder.andWhere('manufacturer.image IS NULL');
      }
    }

    queryBuilder.orderBy('manufacturer.createdAt', 'DESC');

    // Pagination
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;
    const take = limit;

    queryBuilder.skip(skip).take(take);

    const [manufacturers, total] = await queryBuilder.getManyAndCount();

    return {
      data: manufacturers,
      total,
      totalPages: Math.ceil(total / limit),
      limit,
    };
  }

  //! Silme
  async delete(ids: number[]) {
    if (ids.length === 0) {
      throw new NotFoundException("Silinecek marka ID'leri belirtilmemiş.");
    }

    const manufacturers = await this.manufacturerRepository.findBy({
      id: In(ids),
    });

    if (!ids.length) {
      throw new NotFoundException('Silinecek marka(lar) bulunamadı.');
    }

    for (const manufcturer of manufacturers) {
      if (manufcturer.image) {
        try {
          await unlinkAsync(manufcturer.image);
          console.log(`Resim başarıyla silindi: ${manufcturer.image}`);
        } catch (err) {
          console.error('Resim silinirken bir hata oluştu:', err);
        }
      }
    }

    const result = await this.manufacturerRepository.delete(ids);

    if (result.affected === 0) {
      throw new NotFoundException('Silinecek marka(lar) bulunamadı.');
    }

    return successReturn({ message: 'Marka(lar) başarıyla silindi.' });
  }

  async getAll(name: string) {
    return this.manufacturerRepository.find({
      where: { name: Like(`%${name}%`) },
      select: ['id', 'name'],
    });
  }

  //* Admin Panel Select
  async getSelectManufacturer(query: {
    name: string;
    page: string;
    limit: string;
  }) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 50;
    const skip = (page - 1) * limit;
    const manufacturers = await this.manufacturerRepository.find({
      select: ['id', 'name'],
      where: { name: Like(`%${query.name}%`) },
      take: limit,
      skip,
    });

    return manufacturers;
  }
}
