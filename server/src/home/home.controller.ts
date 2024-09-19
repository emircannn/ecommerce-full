import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import {
  GetCategoryProducts,
  GetManufacturerProducts,
} from './dto/create-home.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('categories')
  getCategories() {
    return this.homeService.getHomeList();
  }

  @Get('products')
  getProducts() {
    return this.homeService.getProductList();
  }

  @Get('product')
  getProductWithSeo(@Query('seo') seo: string) {
    return this.homeService.getProductWithSeo(seo);
  }

  @Post('categoryPage')
  getProductsCategoryPage(@Body() filters: GetCategoryProducts) {
    return this.homeService.getProductsCategoryPage(filters);
  }
  @Post('manufacturerPage')
  getProductsManufacturerPage(@Body() filters: GetManufacturerProducts) {
    return this.homeService.getProductsByBrand(filters);
  }
}
