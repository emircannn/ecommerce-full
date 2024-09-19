import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateProductStatusDto {
  @IsArray({ message: "Ürün ID'leri bir dizi olmalıdır." })
  @IsNotEmpty({ each: true, message: "Her ürün ID'si boş olmamalıdır." })
  productIds: number[];

  @IsBoolean({ message: 'Aktiflik durumu boolean bir değer olmalıdır.' })
  isActive: boolean;
}
