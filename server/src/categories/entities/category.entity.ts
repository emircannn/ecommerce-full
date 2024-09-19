import { Coupon } from 'src/coupons/entities/coupon.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: false, unique: true })
  seo: string;

  @ManyToOne(() => Category, category => category.sub_categories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @ManyToOne(() => Category, category => category.home_sub, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  home_parent: Category;

  @Column({ type: 'bool', default: false })
  show_home: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Category, category => category.parent)
  sub_categories: Category[];

  @OneToMany(() => Category, category => category.home_parent)
  home_sub: Category[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @ManyToMany(() => Coupon, coupon => coupon.applicable_categories)
  coupons: Coupon[];
}
