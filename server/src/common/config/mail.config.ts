import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

export const mailConfig: MailerOptions = {
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  },
  defaults: {
    from: '"Dijital Yankı" <noreply@example.com>',
  },
  template: {
    dir: path.join(process.cwd(), 'templates'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
