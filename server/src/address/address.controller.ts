import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { City, District, Neighborhoods } from './entities/map.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { CurrentUser } from 'src/common/decorators/get_current_user.decorator';
import { AtGuard } from 'src/common/guards/at.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @UseGuards(AtGuard)
  @Post('add')
  addNew(@Body() dto: CreateAddressDto, @CurrentUser() user: User) {
    return this.addressService.addNew(dto, user);
  }

  @UseGuards(AtGuard)
  @Post('update')
  update(
    @Body() dto: CreateAddressDto,
    @CurrentUser() user: User,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.addressService.updateAddress(id, dto, user);
  }

  @UseGuards(AtGuard)
  @Post('delete')
  delete(@CurrentUser() user: User, @Query('id', ParseIntPipe) id: number) {
    return this.addressService.deleteAddress(id, user);
  }

  @UseGuards(AtGuard)
  @Get('getAddress')
  getAddress(@CurrentUser() user: User) {
    return this.addressService.getAddress(user);
  }

  //* GET  Islemleri
  @Get('cities')
  async findCitiesByName(@Query('name') name?: string): Promise<City[]> {
    return this.addressService.findCitiesByName(name);
  }

  @Get('districts')
  async findDistrictByName(
    @Query('name') name?: string,
    @Query('city_id', ParseIntPipe) city_id?: number,
  ): Promise<District[]> {
    return this.addressService.findDistrictByName(city_id, name);
  }

  @Get('neighborhoods')
  async findNeighborhoods(
    @Query('name') name?: string,
    @Query('district_id', ParseIntPipe) district_id?: number,
  ): Promise<Neighborhoods[]> {
    return this.addressService.findNeighborhoods(district_id, name);
  }

  //* DB İşlemleri *//
  @Get('fetch')
  async fetchData() {
    const url = 'https://turkiyeapi.dev/api/v1/provinces?fields=id,name';
    return await this.addressService.fetchData(url);
  }

  @Get('city-create')
  async updateCity() {
    const url = 'https://turkiyeapi.dev/api/v1/provinces?fields=id,name';
    return await this.addressService.updateCity(url);
  }

  @Get('district-create')
  async updateDistricts() {
    const url =
      'https://turkiyeapi.dev/api/v1/districts?fields=id,provinceId,name';
    return await this.addressService.updateDistricts(url);
  }

  @Get('neighborhoods-addres-create')
  async updateNeighborhoods() {
    const urls = this.addressService.generateUrls();

    return await this.addressService.updateNeighborhoods(urls);
  }
}
