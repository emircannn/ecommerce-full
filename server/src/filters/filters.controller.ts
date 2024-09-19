import { Controller, Get, Query } from '@nestjs/common';
import { FiltersService } from './filters.service';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get('category')
  async getCategoryFilter(@Query('seo') seo: string) {
    const data = await this.filtersService.getCategoryFilter(seo);
    return data;
  }

  @Get('manufacturer')
  async getManufacturerFilter(@Query('seo') seo: string) {
    const data = await this.filtersService.getBrandFilter(seo);
    return data;
  }

  @Get('status')
  getStatus() {
    return this.filtersService.getStatus();
  }
}
