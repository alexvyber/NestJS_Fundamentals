import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Protocol = createParamDecorator(
  (someValue: string, ctx: ExecutionContext) => {
    console.log('🚀 ~ someValue', someValue);
    const request = ctx.switchToHttp().getRequest();
    return request.protocol;
  },
);
