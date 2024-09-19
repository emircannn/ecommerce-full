import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'city' })
export class City {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  uid: number;

  @Column({ unique: true })
  id: number;

  @Column()
  name: string;
}

@Entity({ name: 'district' })
export class District {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  uid: number;

  @Column({ unique: true })
  id: number;

  @Column()
  name: string;

  @Column()
  city_id: number;
}

@Entity({ name: 'neighborhoods' })
export class Neighborhoods {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  uid: number;

  @Column()
  id: number;

  @Column()
  name: string;

  @Column()
  district_id: number;
}
