import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { VerifyToken } from 'src/common/entities/verify-token.entity';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, VerifyToken])],
  controllers: [AdminController],
  providers: [AdminService, AuthService, MailService],
})
export class AdminModule {}
