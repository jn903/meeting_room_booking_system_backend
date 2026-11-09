import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// 假设你的 JwtUserData 定义类似这样
export interface JwtUserData {
  userId: number;
  username: string;
  roles: string[];
}

export const RequireLogin = () => SetMetadata('require-login', true);

export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('require-permission', permissions);

export const UserInfo = createParamDecorator(
  (data: keyof JwtUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);