import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class VariantGroupDto {
  @IsNotEmpty({ message: 'Seçenek grup isim alanı boş olamaz!' })
  name: string;
}

export class VariantGroupUpdateDto {
  @IsNotEmpty({ message: 'Seçenek grup isim alanı boş olamaz!' })
  name: string;

  @IsNotEmpty({ message: 'Seçenek id alanı boş olamaz!' })
  @Type(() => Number)
  id: number;
}

export class VariantOptionDto {
  @IsNotEmpty({ message: 'Seçenek isim alanı boş olamaz!' })
  name: string;

  @IsNotEmpty({ message: 'Seçenek id alanı boş olamaz!' })
  @Type(() => Number)
  group_id: number;
}
