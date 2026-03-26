import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const gqlHost = GqlArgumentsHost.create(host);

    let message = 'Database error';

    if (exception.code === 'P2002') {
      throw new ConflictException(
        `Unique constraint failed on: ${exception.meta?.target}`,
      );
    }

    if (exception.code === 'P2003') {
      throw new BadRequestException(
        `Invalid reference on field: ${exception.meta?.field_name}`,
      );
    }

    if (exception.code === 'P2025') {
      throw new NotFoundException(
        `Record not found in the database`,
      );
    }
    throw new BadRequestException(message);
  }
}
