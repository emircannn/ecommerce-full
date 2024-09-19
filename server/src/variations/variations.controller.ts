import {
  Controller,
  Post,
  Body,
  Query,
  ParseIntPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { VariationsService } from './variations.service';
import {
  VariantGroupDto,
  VariantGroupUpdateDto,
  VariantOptionDto,
} from './dto/variant.dto';
import { Role } from 'src/users/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AtGuard } from 'src/common/guards/at.guard';

@UseGuards(AtGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('variations')
export class VariationsController {
  constructor(private readonly variationsService: VariationsService) {}

  @Post('create-group')
  createGroup(@Body() dto: VariantGroupDto) {
    return this.variationsService.createGroup(dto.name);
  }

  @Post('create-option')
  optionCreate(@Body() dto: VariantOptionDto) {
    return this.variationsService.optionCreate(dto);
  }

  @Post('delete-group')
  deleteGroup(@Query('id', ParseIntPipe) id: number) {
    return this.variationsService.deleteGroup(id);
  }

  @Post('delete-option')
  deleteOption(@Query('id', ParseIntPipe) id: number) {
    return this.variationsService.deleteOption(id);
  }

  @Post('update-option')
  updateOption(@Body() dto: VariantGroupUpdateDto) {
    return this.variationsService.updateOption(dto);
  }

  @Post('update-group')
  updateGroup(@Body() dto: VariantGroupUpdateDto) {
    return this.variationsService.updateGroup(dto);
  }

  @Get('get-groups')
  getGroups() {
    return this.variationsService.getGroups();
  }

  @Get('get-options')
  getOptions(@Query('id', ParseIntPipe) id: number) {
    return this.variationsService.getOptions(id);
  }
}
