import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Combinations } from 'src/variations/entities/variation.entity';
import { Product } from 'src/products/entities/product.entity';
import { Cart, CartItem } from 'src/cart/entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Combinations, Product, Cart, CartItem]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
