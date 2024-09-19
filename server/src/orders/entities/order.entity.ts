import { OrderAddress } from 'src/address/entities/address.entity';
import { OrderStatus } from 'src/filters/entities/filter.entity';
import { Payment } from 'src/payment/entities/payment.entity';
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
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

//* ORDER *//
@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false, default: 0, type: 'float' })
  product_total: number;

  @Column({ nullable: false, default: 0, type: 'float' })
  total: number;

  @Column({ nullable: false, default: 0, type: 'float' })
  coupon: number;

  @Column({ nullable: false, default: 0, type: 'float' })
  cargo: number;

  @Column({ nullable: true })
  decont: string;

  @Column({ nullable: true })
  bill: string;

  @Column({ nullable: true })
  cargo_code: string;

  @Column({ type: 'boolean', default: false })
  payment_success: boolean;

  @ManyToOne(() => OrderAddress, address => address.orderInvoice, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'invoice_address_id' })
  invoiceAddress: OrderAddress;

  @ManyToOne(() => OrderAddress, address => address.orderIndividual, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'individual_address_id' })
  individualAddress: OrderAddress;

  @Column({ nullable: true, type: 'date' })
  complate_date: Date;

  @Column({ nullable: true, type: 'date' })
  return_accept_date: Date;

  @ManyToOne(() => OrderStatus, status => status.orders, { nullable: false })
  @JoinColumn({ name: 'status_id' })
  status: OrderStatus;

  @ManyToOne(() => Payment, payment_methods => payment_methods.orders, {
    nullable: true,
  })
  @JoinColumn({ name: 'payment_method' })
  payment: Payment;

  @ManyToOne(() => User, user => user.order, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => OrderItem, order_items => order_items.order)
  order_items: OrderItem[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

//* ORDER ITEMS *//
@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Order, order => order.order_items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, product => product.order_items, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Combinations, combination => combination.order_items, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'combination_id' })
  combination: Combinations;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'float' })
  price: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  seo: string;

  @Column({ default: 1, nullable: false })
  quantity: number;

  @ManyToOne(() => OrderStatus, status => status.order_item, {
    nullable: false,
  })
  @JoinColumn({ name: 'status_id' })
  status: OrderStatus;
}
