import { Order, OrderItem } from 'src/orders/entities/order.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
//* ORDER STATUS *//
@Entity({ name: 'status' })
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => Order, order => order.status)
  orders: Order[];

  @OneToMany(() => OrderItem, orderItem => orderItem.status)
  order_item: OrderItem[];
}
