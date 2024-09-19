import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Gender } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'İsim alanı boş olamaz.' })
  @IsString({ message: 'İsim alanı geçerli bir metin olmalıdır.' })
  @MaxLength(150, { message: 'İsim en fazla 150 karakter olabilir.' })
  name: string;

  @IsNotEmpty({ message: 'E-posta adresi boş olamaz.' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  email: string;

  @IsOptional()
  @IsPhoneNumber('TR', { message: 'Geçerli bir telefon numarası giriniz.' })
  phone?: string;

  @IsOptional()
  gender?: Gender;

  @IsNotEmpty({ message: 'Şifre alanı boş olamaz.' })
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'İsim alanı geçerli bir metin olmalıdır.' })
  @MaxLength(150, { message: 'İsim en fazla 150 karakter olabilir.' })
  name: string;

  @IsOptional()
  @IsPhoneNumber('TR', { message: 'Geçerli bir telefon numarası giriniz.' })
  phone?: string;

  @IsOptional()
  gender?: Gender;
}
