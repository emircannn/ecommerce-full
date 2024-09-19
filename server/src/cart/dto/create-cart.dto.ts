import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty({ message: 'Sepet ID boş olamaz.' })
  @IsNumber({}, { message: 'Geçersiz sepet ID.' })
  readonly cartId: number;

  @IsNotEmpty({ message: 'Ürün ID boş olamaz.' })
  @IsNumber({}, { message: 'Geçersiz ürün ID.' })
  readonly productId: number;

  @IsNotEmpty({ message: 'Miktar boş olamaz.' })
  @IsNumber({}, { message: 'Geçersiz miktar.' })
  @IsPositive({ message: 'Miktar pozitif bir değer olmalıdır.' })
  readonly quantity: number;

  @IsOptional()
  @IsNumber({}, { message: 'Geçersiz kombinasyon ID.' })
  readonly combinationId?: number;
}
