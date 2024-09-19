// src/products/dto/get-products.dto.ts

import {
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetProductsDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  readonly categoryIds?: number[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  readonly manufacturerIds?: number[];

  @IsOptional()
  @IsString()
  readonly barcode?: string;

  @IsOptional()
  @IsString()
  readonly sku?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number) // Convert string to number
  readonly page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number) // Convert string to number
  readonly limit?: number = 10;

  @IsOptional()
  @IsEnum(SortOrder)
  readonly sortBy?: SortOrder = SortOrder.ASC;

  @IsOptional()
  @IsString()
  readonly sortField?: string;

  @IsOptional()
  @Type(() => Boolean) // Convert string to boolean
  @IsBoolean()
  readonly sortByPrice?: boolean = false;

  @IsOptional()
  readonly hasImage?: string;

  @IsOptional()
  readonly isActive?: string;
}
