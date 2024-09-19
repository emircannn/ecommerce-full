import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyToken } from 'src/common/entities/verify-token.entity';
@Module({
  imports: [TypeOrmModule.forFeature([VerifyToken])],
  providers: [CronService],
})
export class CronModule {}
