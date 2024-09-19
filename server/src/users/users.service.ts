import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  compareValues,
  errorReturn,
  hashValue,
  successReturn,
} from 'utils/helpers';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  //* Kayit *//
  async register(dto: CreateUserDto, response: Response) {
    const matched = await this.isUserExist({
      email: dto.email,
      phone: dto.phone,
    });

    if (matched) {
      return errorReturn(
        'Bu e-posta adresi veya telefon numarası zaten bir hesaba kayıtlıdır. Lütfen farklı bir e-posta adresi veya telefon numarası kullanın.',
      );
    }

    const newUser = this.userRepository.create({
      ...dto,
      password: await hashValue(dto.password),
    });

    const createdUser = await this.userRepository.save({
      ...newUser,
      refresh_token: null,
    });

    const tokens = await this.authService.getTokens(
      createdUser.id,
      createdUser.email,
    );

    response.cookie('Access', tokens.access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 20 * 60 * 1000),
    });

    response.cookie('Refresh', tokens.access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await this.authService.updateRToken(createdUser.id, tokens.refresh_token);

    return successReturn({
      message: 'Kayıt başarıyla oluşturuldu.',
      data: tokens,
    });
  }

  async getUsers(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      select: ['name', 'email', 'email_verified', 'phone', 'gender'],
    });
  }

  async updateUser(userId: number, dto: UpdateUserDto) {
    if (dto.phone) {
      const matchedByPhone = await this.userRepository.findOneBy({
        phone: dto.phone,
      });

      if (matchedByPhone) {
        throw new BadRequestException('Bu telefon numarası zaten mevcut.');
      }
    }

    await this.userRepository.update(userId, dto);

    return successReturn({
      message: 'Kullanıcı bilgileri başarıyla güncellendi.',
    });
  }

  //* Kontrol Servisleri *//

  //* Dogrulama *//
  async verifyUser(email: string, password: string) {
    const user = await this.findWithEmail(email);

    if (!user) throw new UnauthorizedException('Kullanıcı Bulunamadı!');

    const passwordIsMatch = await compareValues(password, user.password);

    if (!passwordIsMatch) {
      throw new UnauthorizedException('Şifreniz Eşleşmiyor!');
    }
    return user;
  }

  async findWithEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findWithId(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async isUserExist({ email, phone }: { email: string; phone: string }) {
    const matchedByEmail = await this.userRepository.findOneBy({ email });
    const matchedByPhone = await this.userRepository.findOneBy({ phone });

    if (matchedByEmail || matchedByPhone) {
      return true;
    }

    return false;
  }
}
