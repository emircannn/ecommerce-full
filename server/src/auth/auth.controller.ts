import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local.guard';
import { CurrentUser } from 'src/common/decorators/get_current_user.decorator';
import { Role, User } from 'src/users/entities/user.entity';
import { Request, Response } from 'express';
import { AtGuard } from 'src/common/guards/at.guard';
import { generateVerificationCode, successReturn } from 'utils/helpers';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GoogleAuthGuard } from 'src/common/guards/google.guard';
import {
  ChangePasswordDto,
  ForgotPassword,
  ResetPasswordDto,
} from './dto/change-password.dto';
import { MailService } from 'src/common/services/mail.service';
import { ClientInfo } from 'src/common/decorators/client-info.decorator';
import { ClientInfoType } from 'src/common/types';
import { Logger } from 'winston';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RtGuard } from 'src/common/guards/rt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: MailService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  //* Login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
    @ClientInfo() clientInfo: ClientInfoType,
  ) {
    const jwt = await this.authService.login(user, response);
    this.logger.log(
      `Kullanıcı giriş işlemi: E-posta: ${user.email}, IP adresi: ${clientInfo.ipAddress}, Kullanıcı Ajanı: ${clientInfo.userAgent}`,
      'AuthController',
    );
    return successReturn({ data: jwt, message: 'Giriş İşlemi Başarılı' });
  }

  //! Logout
  @UseGuards(AtGuard)
  @Get('logout')
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

  //* Auth Check
  @Get('check')
  authCheck(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['Access'];
    const refreshToken = req.cookies['Refresh'];

    return this.authService.authCheck(token, refreshToken, res);
  }

  //*Refresh Token
  @UseGuards(RtGuard)
  @Get('refresh')
  refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshToken(user.id, user.refresh_token, response);
  }

  //* Change Password
  @UseGuards(AtGuard)
  @Post('change-password')
  changePassword(
    @CurrentUser() user: User,
    @Body() dto: ChangePasswordDto,
    @ClientInfo() clientInfo: ClientInfoType,
  ) {
    this.logger.log(
      `Şifre Değiştirme işlemi: E-posta: ${user.email}, IP adresi: ${clientInfo.ipAddress}, Kullanıcı Ajanı: ${clientInfo.userAgent}`,
      'AuthController',
    );
    return this.authService.changePassword(user, dto);
  }

  //*SEND VERIFY CODE
  @UseGuards(AtGuard)
  @Post('send-verification')
  async sendVerification(@CurrentUser() user: User) {
    const code = generateVerificationCode();
    const date = await this.authService.sendVerificationEmailCode(user, code);
    await this.emailService.sendVerificationEmail(user.email, user.name, code);
    return successReturn({
      message: 'Email adresinize doğrulama kodu gönderilmiştir.',
      data: date,
    });
  }

  //*Verify User
  @UseGuards(AtGuard)
  @Post('verify-user')
  verifyUser(@CurrentUser() user: User, @Body() dto: { code: string }) {
    return this.authService.verifyUser(user, dto.code);
  }

  //*SEND Password CODE
  @Post('send-password-code')
  sendPasswordCode(@Body() dto: ForgotPassword) {
    return this.authService.sendPasswordCode(dto);
  }

  //*RESET Password
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('csrf-token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const csrfToken = req.csrfToken();
    res.json({ csrfToken });
  }

  @Get()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  //* GOOGLE
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!user) {
      return response.redirect(`${process.env.CLIENT}/google-auth?login=error`);
    }

    await this.authService.login(user, response);

    response.redirect(`${process.env.CLIENT}/google-auth?login=success`);
  }
}
