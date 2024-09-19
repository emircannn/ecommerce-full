import { Module } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { FiltersController } from './filters.controller';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import { Manufacturer } from 'src/manufacturers/entities/manufacturer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Combinations } from 'src/variations/entities/variation.entity';
import { OrderStatus } from './entities/filter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      Manufacturer,
      Combinations,
      OrderStatus,
    ]),
  ],
  controllers: [FiltersController],
  providers: [FiltersService],
})
export class FiltersModule {}
