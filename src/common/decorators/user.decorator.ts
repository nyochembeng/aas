import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: keyof Express.User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null; // Handle cases where there's no authenticated user
    }

    return data ? user[data] : user; // Return a specific property or the full user object
  },
);
