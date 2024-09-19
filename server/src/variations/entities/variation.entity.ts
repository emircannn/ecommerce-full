import { OrderItem } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'variation_groups' })
export class VariationGroups {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @OneToMany(
    () => VariationOptions,
    variantOption => variantOption.variant_group,
    { cascade: true },
  )
  variant_options: VariationOptions[];
}

@Entity({ name: 'variation_options' })
export class VariationOptions {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  value: string;

  @ManyToOne(
    () => VariationGroups,
    variantGroup => variantGroup.variant_options,
    { onDelete: 'CASCADE' },
  )
  variant_group: VariationGroups;
}

@Entity({ name: 'combinations' })
export class Combinations {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'json', nullable: false })
  variant_values: {
    variant_group_id: string;
    id: number;
    value: string;
  }[];

  @Column({ default: 0, type: 'float' })
  price: number;

  @Column({ default: null, type: 'float', nullable: true })
  special?: number;

  @Column({ default: null, nullable: true })
  discount_rate: number;

  @Column({ nullable: false })
  stock: number;

  @Column({ nullable: false })
  barcode: string;

  @Column({ nullable: false })
  sku: string;

  @Column({ nullable: true })
  weight?: number;

  @ManyToOne(() => Product, product => product.combinations, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @OneToMany(() => OrderItem, order_items => order_items.combination, {
    onDelete: 'CASCADE',
  })
  order_items: OrderItem[];
}

@Entity({ name: 'variants' })
export class Variant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => Product, product => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => VariantValue, variantValue => variantValue.variant)
  values: VariantValue[];
}

@Entity({ name: 'variant_values' })
export class VariantValue {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  uid: number;

  @Column()
  id: number;

  @Column({ nullable: false })
  value: string;

  @Column({ type: 'simple-array', nullable: true })
  combinations: string[];

  @ManyToOne(() => Variant, variant => variant.values, {
    onDelete: 'CASCADE',
  })
  variant: Variant;
}
