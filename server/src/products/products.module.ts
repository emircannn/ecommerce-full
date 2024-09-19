import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Manufacturer } from 'src/manufacturers/entities/manufacturer.entity';
import { Category } from 'src/categories/entities/category.entity';
import {
  Combinations,
  Variant,
  VariantValue,
} from 'src/variations/entities/variation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Manufacturer,
      Category,
      Combinations,
      Variant,
      VariantValue,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
