import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import { Combinations } from 'src/variations/entities/variation.entity';
import { FiltersService } from 'src/filters/filters.service';
import { Manufacturer } from 'src/manufacturers/entities/manufacturer.entity';
import { OrderStatus } from 'src/filters/entities/filter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      Combinations,
      Manufacturer,
      OrderStatus,
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService, FiltersService],
})
export class HomeModule {}
