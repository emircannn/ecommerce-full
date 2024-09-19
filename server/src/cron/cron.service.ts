import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyToken } from 'src/common/entities/verify-token.entity';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(VerifyToken)
    private readonly tokenRepository: Repository<VerifyToken>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Europe/Istanbul' })
  async handleDeleteToken() {
    const now = new Date();
    // Süresi geçmiş tokenleri sil
    await this.tokenRepository.delete({
      expire_date: LessThan(now),
    });

    console.log('Süresi geçmiş tokenler silindi.');
  }
}
