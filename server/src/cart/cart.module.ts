import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem } from './entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';
import { Combinations } from 'src/variations/entities/variation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Product, Combinations, Cart])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
