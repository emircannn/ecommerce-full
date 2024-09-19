import { Module } from '@nestjs/common';
import { VariationsService } from './variations.service';
import { VariationsController } from './variations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariationGroups, VariationOptions } from './entities/variation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VariationGroups, VariationOptions])],
  controllers: [VariationsController],
  providers: [VariationsService],
})
export class VariationsModule {}
