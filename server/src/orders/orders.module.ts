import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Cart, CartItem } from 'src/cart/entities/cart.entity';
import { Combinations } from 'src/variations/entities/variation.entity';
import { Address, OrderAddress } from 'src/address/entities/address.entity';
import { PaymentService } from 'src/payment/payment.service';
import { User } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/filters/entities/filter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Product,
      Cart,
      CartItem,
      Combinations,
      OrderItem,
      Address,
      OrderAddress,
      OrderStatus,
      User,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PaymentService],
})
export class OrdersModule {}
