import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { json } from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3100;
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('/api');

  const corsOptions: CorsOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://next.dmnwebreklam.com',
      'https://next.dmnwebreklam.com',
      'https://mobilya.dmnwebreklam.com',
      'http://mobilya.dmnwebreklam.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);
  app.use(cookieParser());
  app.use(json({ limit: '100mb' }));

  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 1000,
      },
    }),
  );

  await app.listen(port, () => {
    console.log(`listening on ${port}, mode: ${process.env.NODE_ENV}`);
  });
}
bootstrap();
