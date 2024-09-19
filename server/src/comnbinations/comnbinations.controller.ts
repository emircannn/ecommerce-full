import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ComnbinationsService } from './comnbinations.service';
import { CombineVariantsDto } from './dto/comnbination.dto';

@Controller('comnbinations')
export class ComnbinationsController {
  constructor(private readonly comnbinationsService: ComnbinationsService) {}

  @Post()
  getCombinations(@Body() variants: CombineVariantsDto[]) {
    return this.comnbinationsService.generateCombinationDraft(variants);
  }

  @Get('selectedComb')
  getSelectedComb(@Query('id', ParseIntPipe) id: number) {
    return this.comnbinationsService.getSelectedComb(id);
  }
}
