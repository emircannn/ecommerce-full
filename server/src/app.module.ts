import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CartModule } from './cart/cart.module';
import { ReturnsModule } from './returns/returns.module';
import { CancelsModule } from './cancels/cancels.module';
import { OrdersModule } from './orders/orders.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CouponsModule } from './coupons/coupons.module';
import { VariationsModule } from './variations/variations.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AddressModule } from './address/address.module';
import { User } from './users/entities/user.entity';
import { Review } from './reviews/entities/review.entity';
import { Cart, CartItem } from './cart/entities/cart.entity';
import { Address, OrderAddress } from './address/entities/address.entity';
import { Product } from './products/entities/product.entity';
import { CategoriesModule } from './categories/categories.module';
import { Order, OrderItem } from './orders/entities/order.entity';
import { Return } from './returns/entities/return.entity';
import { Category } from './categories/entities/category.entity';
import { Cancel } from './cancels/entities/cancel.entity';
import { Coupon, CouponUsage } from './coupons/entities/coupon.entity';
import { Wishlist } from './wishlist/entities/wishlist.entity';
import {
  Combinations,
  Variant,
  VariantValue,
  VariationGroups,
  VariationOptions,
} from './variations/entities/variation.entity';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { Manufacturer } from './manufacturers/entities/manufacturer.entity';
import { PaymentModule } from './payment/payment.module';
import { Payment } from './payment/entities/payment.entity';
import { GloabalModuleConfig } from './common/global.modules';
import { City, District, Neighborhoods } from './address/entities/map.entity';
import { VerifyToken } from './common/entities/verify-token.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailConfig } from './common/config/mail.config';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { loggerConfig } from './common/config/winston-config';
import { WinstonModule } from 'nest-winston';
import { ComnbinationsModule } from './comnbinations/comnbinations.module';
import { HomeModule } from './home/home.module';
import { QuestionsModule } from './questions/questions.module';
import { Question } from './questions/entities/question.entity';
import { FiltersModule } from './filters/filters.module';
import { OrderStatus } from './filters/entities/filter.entity';

@Module({
  imports: [
    GloabalModuleConfig,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MailerModule.forRoot(mailConfig),
    WinstonModule.forRoot(loggerConfig),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      entities: [
        User,
        Review,
        Cart,
        Address,
        Product,
        Order,
        Return,
        Category,
        Cancel,
        Coupon,
        Wishlist,
        VariationGroups,
        VariationOptions,
        Manufacturer,
        Variant,
        Combinations,
        VariantValue,
        CartItem,
        CouponUsage,
        OrderAddress,
        OrderStatus,
        Payment,
        OrderItem,
        City,
        District,
        Neighborhoods,
        VerifyToken,
        Question,
      ],
      synchronize: true,
    }),
    UsersModule,
    ProductsModule,
    WishlistModule,
    CartModule,
    ReturnsModule,
    CancelsModule,
    OrdersModule,
    AdminModule,
    AuthModule,
    CouponsModule,
    VariationsModule,
    ReviewsModule,
    AddressModule,
    CategoriesModule,
    ManufacturersModule,
    PaymentModule,
    CronModule,
    ComnbinationsModule,
    HomeModule,
    QuestionsModule,
    FiltersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
