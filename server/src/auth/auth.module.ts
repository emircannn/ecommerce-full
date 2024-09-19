import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { LocalStategy } from 'src/common/strategies/local-strategy';
import { AtStrategy } from 'src/common/strategies/at-strategy';
import { RtStrategy } from 'src/common/strategies/rt-strategy';
import { UsersModule } from 'src/users/users.module';
import { GoogleStrategy } from 'src/common/strategies/google.startegy';
import { MailService } from 'src/common/services/mail.service';
import { VerifyToken } from 'src/common/entities/verify-token.entity';
import { Logger } from 'winston';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, VerifyToken])],
  controllers: [AuthController],
  providers: [
    AuthService,
    MailService,
    LocalStategy,
    AtStrategy,
    RtStrategy,
    GoogleStrategy,
    Logger,
  ],
  exports: [AuthService],
})
export class AuthModule {}
