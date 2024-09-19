import { CartItem } from 'src/cart/entities/cart.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Manufacturer } from 'src/manufacturers/entities/manufacturer.entity';
import { OrderItem } from 'src/orders/entities/order.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Review } from 'src/reviews/entities/review.entity';
import {
  Combinations,
  Variant,
} from 'src/variations/entities/variation.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  seo: string;

  @Column({ nullable: true })
  short_desc: string;

  @Column({ nullable: false, type: 'text' })
  desc: string;

  @Column({ default: 0, type: 'float' })
  price: number;

  @Column({ default: null, type: 'float', nullable: true })
  special?: number;

  @Column({ default: null, nullable: true })
  discount_rate: number;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'json', nullable: true })
  images?: string[];

  @Column({ unique: true })
  sku: string;

  @Column({ unique: true })
  barcode: string;

  @Column({ nullable: false })
  mpn: number;

  @Column({ nullable: false })
  stock: number;

  @Column({ nullable: true, default: null })
  weight: number;

  @Column({ default: true, type: 'boolean' })
  is_active: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  view_count: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  offer_date: Date;

  @OneToMany(() => Variant, variant => variant.product, { cascade: true })
  variants: Variant[];

  @OneToMany(() => Combinations, combination => combination.product, {
    cascade: true,
  })
  combinations: Combinations[];

  @OneToMany(() => CartItem, cartItem => cartItem.cart, {
    cascade: true,
  })
  cart_items: CartItem[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @OneToMany(() => Question, question => question.product, { cascade: true })
  questions: Question[];

  @ManyToOne(() => Category, category => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToOne(() => Manufacturer, manufacturer => manufacturer.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  manufacturer: Manufacturer;

  @ManyToMany(() => Wishlist, wishlist => wishlist.products)
  wishlists: Wishlist[];

  @ManyToMany(() => Coupon, coupon => coupon.applicable_products)
  coupons: Coupon[];

  @OneToMany(() => OrderItem, order_items => order_items.product)
  order_items: OrderItem[];
}
