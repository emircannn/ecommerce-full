import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { AddressType, BillingType } from '../entities/address.entity';
import { Type } from 'class-transformer';

export class CreateAddressDto {
  @IsNotEmpty({ message: 'Başlık alanı boş bırakılamaz.' })
  @IsString({ message: 'Başlık alanı metin olmalıdır.' })
  title: string;

  @IsNotEmpty({ message: 'Birincil adres belirtmek zorunludur.' })
  @IsBoolean({ message: 'Birincil alanı doğru veya yanlış olmalıdır.' })
  primary: boolean;

  @IsOptional()
  @IsString({ message: 'Vergi numarası metin olmalıdır.' })
  tax_no?: string;

  @IsNotEmpty({ message: 'Adres tipi belirtilmelidir.' })
  @IsEnum(AddressType, { message: 'Geçersiz adres tipi.' })
  address_type: AddressType;

  @IsOptional()
  @IsEnum(BillingType, { message: 'Geçersiz fatura türü.' })
  billing_type?: BillingType;

  @IsNotEmpty({ message: 'İsim alanı boş bırakılamaz.' })
  @IsString({ message: 'İsim alanı metin olmalıdır.' })
  name: string;

  @IsNotEmpty({ message: 'Soyisim alanı boş bırakılamaz.' })
  @IsString({ message: 'Soyisim alanı metin olmalıdır.' })
  lastname: string;

  @IsOptional()
  @IsString({ message: 'TC kimlik numarası metin olmalıdır.' })
  tck_no?: string;

  @IsOptional()
  @IsString({ message: 'Şirket adı metin olmalıdır.' })
  company_name?: string;

  @IsOptional()
  @IsString({ message: 'Vergi dairesi metin olmalıdır.' })
  tax_office?: string;

  @IsNotEmpty({ message: 'Telefon numarası boş bırakılamaz.' })
  @IsString({ message: 'Telefon numarası metin olmalıdır.' })
  phone: string;

  @IsNotEmpty({ message: "Şehir ID'si belirtilmelidir." })
  @Type(() => Number)
  @IsNumber({}, { message: "Şehir ID'si geçerli bir sayı olmalıdır." })
  city_id: number;

  @IsNotEmpty({ message: 'Şehir adı belirtilmelidir.' })
  @IsString({ message: 'Şehir adı metin olmalıdır.' })
  city: string;

  @IsNotEmpty({ message: 'İlçe adı belirtilmelidir.' })
  @IsString({ message: 'İlçe adı metin olmalıdır.' })
  district: string;

  @IsNotEmpty({ message: "İlçe ID'si belirtilmelidir." })
  @Type(() => Number)
  @IsNumber({}, { message: "İlçe ID'si geçerli bir sayı olmalıdır." })
  district_id: number;

  @IsNotEmpty({ message: 'Mahalle adı belirtilmelidir.' })
  @IsString({ message: 'Mahalle adı metin olmalıdır.' })
  neighborhoods: string;

  @IsNotEmpty({ message: "Mahalle ID'si belirtilmelidir." })
  @Type(() => Number)
  @IsNumber({}, { message: "Mahalle ID'si geçerli bir sayı olmalıdır." })
  neighborhoods_id: number;

  @IsNotEmpty({ message: 'Adres belirtilmelidir.' })
  @IsString({ message: 'Adres metin olmalıdır.' })
  address: string;
}
