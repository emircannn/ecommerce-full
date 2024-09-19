import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TokenType {
  FOR_PASSWORD = 'password',
  FOR_EMAIL = 'email',
}

@Entity({ name: 'verify_token' })
export class VerifyToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  token: string;

  @Column({ nullable: false })
  user_id: number;

  @Column({ type: 'enum', enum: TokenType, default: TokenType.FOR_EMAIL })
  type: string;

  @Column({ type: 'timestamp' })
  expire_date: Date;
}
