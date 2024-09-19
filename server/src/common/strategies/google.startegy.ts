import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const user = await this.authService.validateGoogleUser({
        email: profile.emails[0].value,
        verify: profile.emails[0].verified,
        name: profile.displayName,
      });

      if (!user) {
        throw new UnauthorizedException('Bir Hata oluştu');
      }

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
