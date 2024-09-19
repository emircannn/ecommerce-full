import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'review' })
export class Review {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
  rating: number;

  @Column({ nullable: false })
  comment: string;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @ManyToOne(() => User, user => user.reviews)
  user: User;

  @ManyToOne(() => Product, product => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
