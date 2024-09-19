import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'coupons' })
export class Coupon {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: 0, type: 'float' })
  min_total: number;

  @Column({ nullable: false, default: 0, type: 'float' })
  total: number;

  @Column({ nullable: false, default: 1 })
  amount: number;

  @Column({ nullable: false, unique: true })
  code: string;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  end_date: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: ['user', 'product', 'category'],
    nullable: false,
  })
  target_type: 'user' | 'product' | 'category';

  @OneToMany(() => CouponUsage, couponUsage => couponUsage.coupon)
  couponUsages: CouponUsage[];

  @ManyToMany(() => User, user => user.coupons)
  @JoinTable({ name: 'user_coupons' })
  applicable_users: User[];

  @ManyToMany(() => Product, product => product.coupons)
  @JoinTable({ name: 'product_coupons' })
  applicable_products: Product[];

  @ManyToMany(() => Category, category => category.coupons)
  @JoinTable({ name: 'category_coupons' })
  applicable_categories: Category[];
}

@Entity({ name: 'coupon_usages' })
export class CouponUsage {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Coupon, coupon => coupon.couponUsages)
  coupon: Coupon;

  @ManyToOne(() => User, user => user.couponUsages)
  user: User;

  @Column({ type: 'date', nullable: false })
  used_at: Date;
}
