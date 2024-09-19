import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SortOrder } from 'src/products/dto/getProducts.entity';

export class GetCategoryProducts {
  @IsNotEmpty()
  categorySeo: string;

  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @IsOptional()
  readonly categoryIds?: number[];

  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @IsOptional()
  manufacturerIds?: number[];

  @IsOptional()
  rating: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number) // Convert string to number
  readonly page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number) // Convert string to number
  readonly limit?: number = 20;

  @IsOptional()
  @IsEnum(SortOrder)
  readonly sortBy?: SortOrder = SortOrder.ASC;

  @IsOptional()
  @IsString()
  readonly sortField?: string;
}

export class GetManufacturerProducts {
  @IsNotEmpty()
  manufacturerSeo: string;

  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @IsOptional()
  readonly categoryIds?: number[];

  @IsOptional()
  rating: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number) // Convert string to number
  readonly page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number) // Convert string to number
  readonly limit?: number = 20;

  @IsOptional()
  @IsEnum(SortOrder)
  readonly sortBy?: SortOrder = SortOrder.ASC;

  @IsOptional()
  @IsString()
  readonly sortField?: string;
}
