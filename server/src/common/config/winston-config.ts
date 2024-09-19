import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const loggerConfig = {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '730d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
};
