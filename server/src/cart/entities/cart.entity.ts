import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Combinations } from 'src/variations/entities/variation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ default: 0, type: 'float' })
  product_total: number;

  @Column({ default: 0, type: 'float' })
  cargo: number;

  @Column({ default: 0, type: 'float' })
  coupon: number;

  @Column({ default: 0, type: 'float' })
  total: number;

  @Column({ nullable: true })
  session_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => User, user => user.cart, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  cart_items: CartItem[];
}

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Cart, cart => cart.cart_items, {
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => Combinations, { nullable: true, onDelete: 'CASCADE' })
  combination: Combinations;

  @Column({ default: 1, nullable: false })
  quantity: number;

  @Column({ default: 0, type: 'float' })
  price: number;
}
