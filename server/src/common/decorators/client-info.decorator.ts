import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userAgent = request.headers['user-agent'];
    const ipAddress = request.headers['x-forwarded-for'] || request.ip;

    return { userAgent, ipAddress };
  },
);
