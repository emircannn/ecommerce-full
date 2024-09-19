import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

interface JwtPayload {
  id: number;
  email: string;
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Access ||
          request?.Access ||
          request?.headers.Access,
      ]),
      secretOrKey: configService.get('AT_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    return this.usersService.findWithId(payload.id);
  }
}
