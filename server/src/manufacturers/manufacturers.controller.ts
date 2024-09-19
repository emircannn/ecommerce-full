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
import { ManufacturersService } from './manufacturers.service';
import { ManufacturerDto, ManufacturerUpdateDto } from './dto/manufacturer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'utils/helpers';
import { AtGuard } from 'src/common/guards/at.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/entities/user.entity';
import { GetProductsDto } from 'src/products/dto/getProducts.entity';

@UseGuards(AtGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('manufacturer')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', multerOptions('/uploads/manufacturers')),
  )
  create(
    @Body() dto: ManufacturerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? `uploads/manufacturers/${file.filename}` : null;
    return this.manufacturersService.create(dto, imagePath);
  }

  @Post('update')
  @UseInterceptors(
    FileInterceptor('image', multerOptions('/uploads/manufacturers')),
  )
  update(
    @Body() dto: ManufacturerUpdateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = file ? `uploads/manufacturers/${file.filename}` : null;
    return this.manufacturersService.update(dto, imagePath);
  }

  @Post('delete')
  delete(@Body() dto: { ids: number[] }) {
    return this.manufacturersService.delete(dto.ids);
  }

  @Get('admin/manufacturers')
  getAdminList(@Query() dto: GetProductsDto) {
    return this.manufacturersService.getAdminProductList(dto);
  }

  @Get('select-all')
  getAll(@Query('name') name: string) {
    return this.manufacturersService.getAll(name);
  }

  @Get('admin/select')
  getSelection(@Query() query: { name: string; page: string; limit: string }) {
    return this.manufacturersService.getSelectManufacturer(query);
  }
}
