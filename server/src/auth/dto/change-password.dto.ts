import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'Mevcut Şifre geçerli bir metin olmalıdır.' })
  @IsNotEmpty({ message: 'Mevcut Şifre alanı boş olamaz.' })
  oldPassword: string;

  @IsNotEmpty({ message: 'Şifre alanı boş olamaz.' })
  @IsString({ message: 'Şifre geçerli bir metin olmalıdır.' })
  newPassword: string;
}

export class ForgotPassword {
  @IsEmail({}, { message: 'Lütfen geçerli bir email adresi girin.' })
  @IsNotEmpty({ message: 'Email Alanı Boş Bırakılamaz' })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Doğrulama Kodu Alanı Boş Bırakılamaz' })
  token: string;

  @IsNotEmpty({ message: 'Şifre alanı boş olamaz.' })
  @IsString({ message: 'Şifre geçerli bir metin olmalıdır.' })
  newPassword: string;
}
