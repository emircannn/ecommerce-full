import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import {
  compareValues,
  generateVerificationCode,
  hashValue,
  successReturn,
} from 'utils/helpers';
import {
  ChangePasswordDto,
  ForgotPassword,
  ResetPasswordDto,
} from './dto/change-password.dto';
import {
  TokenType,
  VerifyToken,
} from 'src/common/entities/verify-token.entity';
import { MailService } from 'src/common/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerifyToken)
    private readonly tokenRepository: Repository<VerifyToken>,
    private readonly jwtService: JwtService,
    private readonly emailService: MailService,
  ) {}

  //* Giris
  async login(user: User, res: Response) {
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRToken(user.id, tokens.refresh_token);

    res.cookie('Access', tokens.access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 20 * 60 * 1000),
    });

    res.cookie('Refresh', tokens.refresh_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return tokens;
  }

  //* Refresh Token
  async refreshToken(id: number, token: string, res: Response) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Erişim Engeli!');
    }

    const tokenIsMatch = await compareValues(token, user.refresh_token);

    if (!tokenIsMatch) throw new ForbiddenException('Erişim Engeli!');

    const tokens = await this.getTokens(id, user.email);
    await this.updateRToken(id, tokens.refresh_token);

    res.cookie('Access', tokens.access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 20 * 60 * 1000),
    });

    res.cookie('Refresh', tokens.refresh_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return tokens;
  }

  async authCheck(token: string, refreshToken: string, res: Response) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.AT_SECRET,
      });
      return { valid: true };
    } catch (error) {
      try {
        const refreshT = await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.RT_SECRET,
        });

        const user = await this.userRepository.findOne({
          where: { id: parseInt(refreshT.id) },
        });

        if (!user || !user.refresh_token) {
          return { valid: false };
        }

        const tokenIsMatch = await compareValues(
          refreshToken,
          user.refresh_token,
        );

        if (!tokenIsMatch) return { valid: false };

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRToken(user.id, tokens.refresh_token);

        res.cookie('Access', tokens.access_token, {
          httpOnly: true,
          expires: new Date(Date.now() + 20 * 60 * 1000),
        });

        res.cookie('Refresh', tokens.refresh_token, {
          httpOnly: true,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return { valid: true };
      } catch (error) {
        return { valid: false };
      }
    }
  }
  //*Cikis
  async logout(user: User, res: Response) {
    await this.userRepository.update(user.id, { refresh_token: null });

    res.cookie('Access', '', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
    });

    res.cookie('Refresh', '', {
      httpOnly: true,
      expires: new Date(Date.now() + 1000),
    });

    return successReturn({ message: 'Çıkış İşlemi Başarılı.' });
  }

  //* Şifre Değiştirme
  async changePassword(user: User, dto: ChangePasswordDto) {
    const isMatchPassword = await compareValues(dto.oldPassword, user.password);

    if (!isMatchPassword) {
      throw new UnauthorizedException('Şifreniz Eşleşmiyor!');
    }

    const newPassword = await hashValue(dto.newPassword);
    await this.userRepository.update(
      { id: user.id },
      { password: newPassword },
    );

    return successReturn({ message: 'Şifreniz başarıyla güncellendi!' });
  }

  //* Şifre Doğrulama Kodu
  async sendPasswordCode(dto: ForgotPassword) {
    const now = new Date();

    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Bu mail adresi ile kayıtlı bir kullanıcı bulunamadı.',
      );
    }

    // Kullanıcının süresi dolmamış bir token'ı olup olmadığını kontrol et
    const existingToken = await this.tokenRepository.findOne({
      where: {
        user_id: user.id,
        expire_date: MoreThan(now), // Geçerli token'ları bul
        type: TokenType.FOR_PASSWORD,
      },
    });

    if (existingToken) {
      throw new BadRequestException(
        'Kullanıcıya ait hâlâ geçerli bir doğrulama kodu var.',
      );
    }

    const expireDate = new Date(now.getTime() + 5 * 60000);
    const code = generateVerificationCode();

    // Yeni token oluştur
    const newToken = this.tokenRepository.create({
      expire_date: expireDate,
      user_id: user.id,
      token: code,
      type: TokenType.FOR_PASSWORD,
    });

    // Yeni token'ı kaydet
    await this.tokenRepository.save(newToken);

    //Mail Yolla
    await this.emailService.sendVerificationPassword(
      user.email,
      user.name,
      code,
    );

    return successReturn({
      message: 'Email adresinize doğrulama kodu gönderilmiştir.',
      data: expireDate,
    });
  }

  //* Şifre Sıfırlama
  async resetPassword(dto: ResetPasswordDto) {
    const now = new Date();
    const existingToken = await this.tokenRepository.findOne({
      where: {
        token: dto.token,
        expire_date: MoreThan(now), // Geçerli token'ları bul
        type: TokenType.FOR_PASSWORD,
      },
    });

    if (!existingToken) {
      throw new BadRequestException(
        'Doğrulama kodu geçersiz veya süresi dolmuş.',
      );
    }

    const newPassword = await hashValue(dto.newPassword);

    await this.userRepository.update(existingToken.user_id, {
      password: newPassword,
    });

    return successReturn({ message: 'Şifreniz başarıyla güncellendi.' });
  }

  //*Email Doğrulama Kodu
  async sendVerificationEmailCode(user: User, code: string) {
    const now = new Date();

    // Kullanıcının süresi dolmamış bir token'ı olup olmadığını kontrol et
    const existingToken = await this.tokenRepository.findOne({
      where: {
        user_id: user.id,
        expire_date: MoreThan(now),
        type: TokenType.FOR_EMAIL,
      },
    });

    if (existingToken) {
      throw new BadRequestException(
        'Kullanıcıya ait hâlâ geçerli bir doğrulama kodu var.',
      );
    }

    // Yeni token'ın expire tarihini belirle (5 dakika)
    const expireDate = new Date(now.getTime() + 5 * 60000);

    // Yeni token oluştur
    const newToken = this.tokenRepository.create({
      expire_date: expireDate,
      user_id: user.id,
      token: code,
      type: TokenType.FOR_EMAIL,
    });

    // Yeni token'ı kaydet
    const token = await this.tokenRepository.save(newToken);

    return token.expire_date;
  }

  //* Kullaniciyi Dogrula
  async verifyUser(user: User, code: string) {
    const now = new Date();

    // Tokenin geçerliliğini ve süresini kontrol et
    const validToken = await this.tokenRepository.findOne({
      where: {
        user_id: user.id,
        token: code,
        expire_date: MoreThan(now), // Geçerli bir token olmalı
        type: TokenType.FOR_EMAIL,
      },
    });

    if (!validToken) {
      throw new BadRequestException(
        'Geçersiz veya süresi dolmuş doğrulama kodu.',
      );
    }

    // Token geçerli, kullanıcının email_verified alanını true yap
    user.email_verified = true;

    // Kullanıcıyı güncelle
    await this.userRepository.save(user);

    // Doğrulama kodunu kullandıktan sonra sil
    await this.tokenRepository.delete({ id: validToken.id });

    return successReturn({ message: 'Kullanıcı başarıyla doğrulandı.' });
  }

  //* Google Kullanici Kontrolu
  async validateGoogleUser(googleUser: {
    email: string;
    name: string;
    verify: boolean;
  }) {
    const user = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });

    if (user) return user;

    const newUser = this.userRepository.create({
      ...googleUser,
      password: '',
      phone: null,
      gender: null,
      email_verified: googleUser.verify,
    });

    return await this.userRepository.save(newUser);
  }

  //*Token Oluşturma
  async getTokens(id: number, email: string) {
    const access_token = this.jwtService.signAsync(
      { id, email },
      {
        secret: `${process.env.AT_SECRET}`,
        expiresIn: 60 * 20,
      },
    );

    const refresh_token = this.jwtService.signAsync(
      { id, email },
      {
        secret: `${process.env.RT_SECRET}`,
        expiresIn: 60 * 60 * 24 * 7,
      },
    );

    const [at, rt] = await Promise.all([access_token, refresh_token]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  //*Refresh Token Güncelleme
  async updateRToken(id: number, token: string) {
    const refresh_token = await hashValue(token);
    return await this.userRepository.update(id, { refresh_token });
  }
}
