import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  show_home: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parentId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  homeParent?: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @Type(() => Number)
  show_home: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parentId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  homeParent?: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;
}

export class GetCategoriesDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  hasImage?: string;

  @IsOptional()
  showHome?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
