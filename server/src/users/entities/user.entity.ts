import { Address } from 'src/address/entities/address.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Coupon, CouponUsage } from 'src/coupons/entities/coupon.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Question } from 'src/questions/entities/question.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
export enum Gender {
  MAN = 'man',
  WOMAN = 'woman',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: Gender,
    default: null,
    nullable: true,
  })
  gender?: Gender;

  @Column({ nullable: true, default: null })
  refresh_token: string;

  @OneToMany(() => Question, question => question.user, { cascade: true })
  questions: Question[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @OneToMany(() => Address, address => address.user)
  address: Address[];

  @OneToMany(() => Order, order => order.user)
  order: Order[];

  @OneToOne(() => Cart, cart => cart.user)
  cart: Cart;

  @OneToOne(() => Wishlist, wishlist => wishlist.user)
  wishlist: Wishlist;

  @OneToMany(() => CouponUsage, couponUsage => couponUsage.user)
  couponUsages: CouponUsage[];

  @ManyToMany(() => Coupon, coupon => coupon.applicable_users)
  coupons: Coupon[];
}
