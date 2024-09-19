import { Injectable, NotFoundException } from '@nestjs/common';
import { City, District, Neighborhoods } from './entities/map.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { CreateAddressDto } from './dto/create-address.dto';
import { User } from 'src/users/entities/user.entity';
import { Address } from './entities/address.entity';
import { successReturn } from 'utils/helpers';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(City)
    private readonly city: Repository<City>,
    @InjectRepository(District)
    private readonly district: Repository<District>,
    @InjectRepository(Neighborhoods)
    private readonly neighborhoods: Repository<Neighborhoods>,
    private readonly httpService: HttpService,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  //* Add New
  async addNew(dto: CreateAddressDto, user: User) {
    if (dto.primary) {
      // Önceki Varsayılan varsa eğer varsayılan olmaktan çıkar
      await this.addressRepository.update(
        { user: user, primary: true },
        { primary: false },
      );
    }

    // Yeni adresi oluştur
    const newAddress = this.addressRepository.create({
      ...dto,
      user,
    });

    return this.addressRepository.save(newAddress);
  }

  // * Update Address
  async updateAddress(id: number, dto: CreateAddressDto, user: User) {
    const address = await this.addressRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!address) {
      throw new NotFoundException('Addres bulunamadı.');
    }

    if (dto.primary) {
      // Eğer yeni primary adres bu adresse, diğer primary adresleri resetle
      await this.addressRepository.update(
        { user: user, primary: true },
        { primary: false },
      );
    }

    // Adres bilgilerini güncelle
    Object.assign(address, dto);

    await this.addressRepository.save(address);

    return successReturn({ message: 'Adres bilgileri başarıyla güncellendi.' });
  }

  // * Delete Address
  async deleteAddress(id: number, user: User) {
    const address = await this.addressRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!address) {
      throw new NotFoundException('Addres bulunamadı.');
    }

    await this.addressRepository.remove(address);

    return successReturn({ message: 'Adres başarıyla silindi.' });
  }

  async getAddress(user: User) {
    const address = await this.addressRepository.find({
      where: { user: { id: user.id } },
    });

    return address;
  }

  //* Şehirler
  async getCities(): Promise<City[]> {
    return this.city.find();
  }

  // İsme göre şehirleri almak için yöntem
  async findCitiesByName(name?: string): Promise<City[]> {
    if (name) {
      return this.city.find({
        where: { name: ILike(`%${name}%`) },
        select: ['id', 'name'],
      });
    }
    return this.getCities();
  }

  //* Ilceler
  async getDistricts(city_id: number): Promise<District[]> {
    return this.district.find({ where: { city_id } });
  }

  async findDistrictByName(
    city_id: number,
    name?: string,
  ): Promise<District[]> {
    if (name) {
      return this.district.find({
        where: { name: ILike(`%${name}%`), city_id },
        select: ['id', 'name'],
      });
    }
    return this.getDistricts(city_id);
  }

  //* Mahalleler

  async getNeighborhoods(district_id: number): Promise<Neighborhoods[]> {
    return this.neighborhoods.find({ where: { district_id } });
  }

  async findNeighborhoods(
    district_id: number,
    name?: string,
  ): Promise<Neighborhoods[]> {
    if (name) {
      return this.neighborhoods.find({
        where: { name: ILike(`%${name}%`), district_id },
        select: ['id', 'name'],
      });
    }
    return this.getNeighborhoods(district_id);
  }

  //* DB İşlemleri *//
  async fetchData(url: string): Promise<any> {
    const response$ = this.httpService
      .get(url)
      .pipe(map(response => response.data));
    return await lastValueFrom(response$);
  }

  async updateCity(url: string) {
    const cities = await this.fetchData(url);
    const newCities = this.city.create(cities.data);
    return await this.city.save(newCities);
  }

  async updateDistricts(url: string) {
    const districts = await this.fetchData(url);
    const transformedData = districts.data.map(item => ({
      id: item.id,
      city_id: item.provinceId,
      name: item.name,
    }));
    return await this.district.save(transformedData);
  }

  async updateNeighborhoods(urls: string[]) {
    const data = [];

    for (const url of urls) {
      const response = await this.fetchData(url);
      if (response.data) {
        data.push(...response.data);
      }
    }

    const transformedNeighborhoods = data.map(item => ({
      id: item.id,
      district_id: item.districtId,
      name: item.name,
    }));

    return await this.neighborhoods.save(transformedNeighborhoods);
  }

  generateUrls() {
    const baseUrls = [
      'https://turkiyeapi.dev/api/v1/neighborhoods?fields=districtId,id,name&offset=0&limit=1000',
      'https://turkiyeapi.dev/api/v1/villages?fields=districtId,id,name&offset=0&limit=1000',
      'https://turkiyeapi.dev/api/v1/towns?fields=districtId,id,name&offset=0&limit=1000',
    ];

    const generatedUrls: string[] = [];
    for (let offset = 0; offset <= 32000; offset += 1000) {
      const url = baseUrls[0].replace('offset=0', `offset=${offset}`);
      generatedUrls.push(url);
    }

    for (let offset = 0; offset <= 18000; offset += 1000) {
      const url = baseUrls[1].replace('offset=0', `offset=${offset}`);
      generatedUrls.push(url);
    }

    generatedUrls.push(baseUrls[2]);

    return generatedUrls;
  }
}
