import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LocalStategy } from 'src/common/strategies/local-strategy';
import { AuthService } from 'src/auth/auth.service';
import { VerifyToken } from 'src/common/entities/verify-token.entity';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, VerifyToken])],
  controllers: [UsersController],
  providers: [UsersService, LocalStategy, AuthService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
