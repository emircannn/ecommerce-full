import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Lütfen geçerli bir email adresi girin.' })
  @IsNotEmpty({ message: 'Email Alanı Boş Bırakılamaz' })
  email: string;

  @IsNotEmpty({ message: 'Şifre Alanı Boş Bırakılamaz' })
  password: string;
}
