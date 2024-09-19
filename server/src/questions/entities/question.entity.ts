import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'question' })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  question: string;

  @Column({ nullable: false })
  aswer: string;

  @ManyToOne(() => Product, product => product.questions, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => User, user => user.questions, {
    onDelete: 'CASCADE',
  })
  user: Product;
}
