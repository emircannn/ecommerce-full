import { Order } from 'src/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum PaymetType {
  EFT = 'eft',
  ONLINE = 'online',
}

@Entity({ name: 'payment_methods' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PaymetType,
    nullable: false,
  })
  type: PaymetType;

  @Column({ nullable: true })
  bank: string;

  @Column({ nullable: true })
  bank_name: string;

  @Column({ nullable: true })
  iban: string;

  @Column({ nullable: true })
  swift: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => Order, order => order.payment)
  orders: Order[];
}
