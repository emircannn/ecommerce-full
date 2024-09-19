import { Module } from '@nestjs/common';
import { ComnbinationsService } from './comnbinations.service';
import { ComnbinationsController } from './comnbinations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Combinations } from 'src/variations/entities/variation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Combinations])],
  controllers: [ComnbinationsController],
  providers: [ComnbinationsService],
})
export class ComnbinationsModule {}
