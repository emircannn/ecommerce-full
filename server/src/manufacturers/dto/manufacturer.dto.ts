import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ManufacturerDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class ManufacturerUpdateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;
}
