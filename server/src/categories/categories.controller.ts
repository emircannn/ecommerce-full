import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'utils/helpers';
import {
  CreateCategoryDto,
  GetCategoriesDto,
  UpdateCategoryDto,
} from './dto/create-category.dto';
import { AtGuard } from 'src/common/guards/at.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/entities/user.entity';

@UseGuards(AtGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('category')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', multerOptions('/uploads/categories')),
  )
  create(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? `uploads/categories/${file.filename}` : null;
    return this.categoriesService.create(dto, imagePath);
  }

  @Post('update')
  @UseInterceptors(
    FileInterceptor('image', multerOptions('/uploads/categories')),
  )
  update(
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? `uploads/categories/${file.filename}` : null;
    return this.categoriesService.update(dto, imagePath);
  }

  @Get('admin/categories')
  async getProducts(@Query() query: GetCategoriesDto) {
    return this.categoriesService.getCategoryList(query);
  }

  @Post('delete')
  delete(@Body() dto: { ids: number[] }) {
    return this.categoriesService.delete(dto.ids);
  }

  @Get('select-all')
  getAll(@Query('name') name: string) {
    return this.categoriesService.getCategoryTree(name);
  }

  @Get('admin/select')
  getSelection(
    @Query()
    query: {
      name?: string;
      page?: string;
      limit?: string;
      show?: string;
    },
  ) {
    return this.categoriesService.getSelectCategory(query);
  }
}
