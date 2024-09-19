import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Ürün adı gereklidir.' })
  @IsNotEmpty({ message: 'Ürün adı boş olamaz.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Kısa açıklama geçerli bir string olmalıdır.' })
  @IsNotEmpty({ message: 'Kısa açıklama boş olamaz.' })
  short_desc: string;

  @IsString({ message: 'Açıklama gereklidir.' })
  @IsNotEmpty({ message: 'Açıklama boş olamaz.' })
  desc: string;

  @IsNumber({}, { message: 'Fiyat geçerli bir sayı olmalıdır.' })
  @IsPositive({ message: 'Fiyat sıfırdan büyük olmalıdır.' })
  @IsNotEmpty({ message: 'Fiyat boş olamaz.' })
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsNumber({}, { message: 'Özel fiyat geçerli bir sayı olmalıdır.' })
  @Type(() => Number)
  special?: number;

  @IsString({ message: 'SKU gereklidir.' })
  @IsNotEmpty({ message: 'SKU boş olamaz.' })
  sku: string;

  @IsString({ message: 'Barkod gereklidir.' })
  @IsNotEmpty({ message: 'Barkod boş olamaz.' })
  barcode: string;

  @IsNumber({}, { message: 'Sevk Değeri geçerli bir sayı olmalıdır.' })
  @IsNotEmpty({ message: 'Sevk Değeri boş olamaz.' })
  @Type(() => Number)
  mpn: number;

  @IsNumber({}, { message: 'Stok geçerli bir sayı olmalıdır.' })
  @IsNotEmpty({ message: 'Stok boş olamaz.' })
  @Type(() => Number)
  stock: number;

  @IsOptional()
  @IsNumber({}, { message: 'Ağırlık geçerli bir sayı olmalıdır.' })
  @Type(() => Number)
  weight?: number;

  @IsNumber({}, { message: 'Kategori ID’si geçerli bir sayı olmalıdır.' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Kategori ID’si boş olamaz.' })
  category: number;

  @IsOptional()
  @IsNumber({}, { message: 'Marka ID’si geçerli bir sayı olmalıdır.' })
  @Type(() => Number)
  manufacturer?: number;

  @IsOptional()
  combinations?: any;
}
