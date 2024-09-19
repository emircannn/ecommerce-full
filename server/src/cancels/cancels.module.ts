import { Module } from '@nestjs/common';
import { CancelsService } from './cancels.service';
import { CancelsController } from './cancels.controller';

@Module({
  controllers: [CancelsController],
  providers: [CancelsService],
})
export class CancelsModule {}
