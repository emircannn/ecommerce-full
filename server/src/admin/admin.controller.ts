import { Controller, Post, Res, Inject, UseGuards } from '@nestjs/common';
import { ClientInfo } from 'src/common/decorators/client-info.decorator';
import { CurrentUser } from 'src/common/decorators/get_current_user.decorator';
import { Role, User } from 'src/users/entities/user.entity';
import { ClientInfoType } from 'src/common/types';
import { successReturn } from 'utils/helpers';
import { AuthService } from 'src/auth/auth.service';
import { MailService } from 'src/common/services/mail.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LocalAuthGuard } from 'src/common/guards/local.guard';
import { Response } from 'express';
import { Logger } from 'winston';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AtGuard } from 'src/common/guards/at.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: MailService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  //* Login
  @UseGuards(LocalAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
    @ClientInfo() clientInfo: ClientInfoType,
  ) {
    const jwt = await this.authService.login(user, response);
    this.logger.log(
      `Admin giriş işlemi: E-posta: ${user.email}, IP adresi: ${clientInfo.ipAddress}, Kullanıcı Ajanı: ${clientInfo.userAgent}`,
      'AuthController',
    );
    return successReturn({ data: jwt, message: 'Giriş İşlemi Başarılı' });
  }

  //*Cikis
  @UseGuards(AtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('logout')
  logout(
    @CurrentUser() user: User,
    @ClientInfo() clientInfo: ClientInfoType,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log(
      `Çıkış işlemi: E-posta: ${user.email}, IP adresi: ${clientInfo.ipAddress}, Kullanıcı Ajanı: ${clientInfo.userAgent}`,
      'AuthController',
    );
    return this.authService.logout(user, response);
  }
}
