import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AddressType {
  BILLING = 'billing',
  DELIVERY = 'delivery',
}

export enum BillingType {
  INDIVIDUAL = 'individual',
  CORPORATE = 'corporate',
}
@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  primary: boolean;

  @Column({ nullable: true })
  tax_no?: string;

  @Column({ type: 'enum', enum: AddressType, default: AddressType.DELIVERY })
  address_type: AddressType;

  @Column({ type: 'enum', enum: BillingType, nullable: true })
  billing_type?: BillingType;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: true })
  tck_no?: string;

  @Column({ nullable: true })
  company_name?: string;

  @Column({ nullable: true })
  tax_office?: string;

  @Column({ nullable: false })
  city_id: number;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  district: string;

  @Column({ nullable: false })
  district_id: number;

  @Column({ nullable: false })
  neighborhoods: string;

  @Column({ nullable: false })
  neighborhoods_id: number;

  @Column({ nullable: false })
  address: string;

  @ManyToOne(() => User, user => user.address, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

@Entity({ name: 'order_address' })
export class OrderAddress {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  tax_no?: string;

  @Column({ type: 'enum', enum: AddressType, default: AddressType.DELIVERY })
  address_type: AddressType;

  @Column({ type: 'enum', enum: BillingType, nullable: true })
  billing_type?: BillingType;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: true })
  tck_no?: string;

  @Column({ nullable: true })
  company_name?: string;

  @Column({ nullable: true })
  tax_office?: string;

  @Column({ nullable: false })
  city_id: number;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  district: string;

  @Column({ nullable: false })
  district_id: number;

  @Column({ nullable: false })
  neighborhoods: string;

  @Column({ nullable: false })
  neighborhoods_id: number;

  @Column({ nullable: false })
  address: string;

  @OneToMany(() => Order, order => order.invoiceAddress, {
    onDelete: 'CASCADE',
  })
  orderInvoice: Order;

  @OneToMany(() => Order, order => order.individualAddress, {
    onDelete: 'CASCADE',
  })
  orderIndividual: Order;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
