import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Refresh ||
          request?.Refresh ||
          request?.headers.Refresh,
      ]),
      passReqToCallback: true,
      secretOrKey: `${process.env.RT_SECRET}`,
    });
  }

  validate(req: Request, payload: any) {
    const refresh_token =
      req.cookies?.Refresh || req.body?.Refresh || req.headers['refresh-token'];
    return {
      ...payload,
      refresh_token,
    };
  }
}
