import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext as ExecutionContextType } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContextType): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
