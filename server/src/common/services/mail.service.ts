import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(
    email: string,
    name: string,
    verificationCode: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Hesap Doğrulama Kodu',
      template: './verification',
      context: {
        name,
        verificationCode,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendVerificationPassword(
    email: string,
    name: string,
    verificationCode: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Şifre Sıfırlama Kodu',
      template: './forgot-password',
      context: {
        name,
        verificationCode,
        year: new Date().getFullYear(),
      },
    });
  }
}
