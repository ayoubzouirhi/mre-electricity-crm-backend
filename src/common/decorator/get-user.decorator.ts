import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const ctx =
      GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user;
    if (data) {
      return user ? user[data] : undefined;
    }
    return request.user;
  },
);
