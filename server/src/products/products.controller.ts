import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AtGuard } from 'src/common/guards/at.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'utils/helpers';
import { GetProductsDto } from './dto/getProducts.entity';
import { UpdateProductStatusDto } from './dto/update-product.dto';

@UseGuards(AtGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('product')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'images', maxCount: 5 },
      ],
      multerOptions('/uploads/products'),
    ),
  )
  create(
    @Body() dto: CreateProductDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    const imagePath =
      files.image && files.image[0]
        ? `uploads/products/${files.image[0].filename}`
        : null;

    const imagePaths = files.images
      ? files.images.map(file => `uploads/products/${file.filename}`)
      : [];

    return this.productsService.create(dto, imagePath, imagePaths);
  }

  @Post('delete')
  async deleteProducts(@Body() dto: { ids: number[] }) {
    return this.productsService.deleteProducts(dto.ids);
  }

  @Get('admin/products')
  async getProducts(@Query() query: GetProductsDto) {
    return this.productsService.getAdminProductList(query);
  }

  @Post('update-status')
  updateProductStatus(@Body() dto: UpdateProductStatusDto) {
    return this.productsService.updateProductStatus(dto);
  }

  @Get('barcode')
  getBarcode() {
    return this.productsService.generateUniqueBarcode();
  }

  @Get('sku')
  getSku() {
    return this.productsService.generateUniqueSKU();
  }
}
