import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Role } from 'src/auth/enums';
import { error } from 'console';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const { password, environment, ...userData } =
      createUserInput;
    const hash = await argon2.hash(password);

    if (environment) {
      const envExist =
        await this.prisma.environment.findUnique({
          where: {
            id: environment,
          },
        });
      if (!envExist) {
        throw new NotFoundException(
          `Environement with ID ${environment} not found`,
        );
      }
    }
    try {
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          hash,
          environmentId: environment || undefined,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async update(
    updateUserInput: UpdateUserInput,
    userId: number,
  ) {
    const { password, environment, ...restData } =
      updateUserInput;

    const dataToUpdate: any = { ...restData };
    if (password) {
      dataToUpdate.hash =
        await argon2.hash(password);
    }
    if (environment) {
      const envExist =
        await this.prisma.environment.findUnique({
          where: {
            id: environment,
          },
        });

      if (!envExist) {
        throw new NotFoundException(
          `Environement with ID ${environment} not found`,
        );
      }
    }
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });
      return user;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('Email already exists');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `User with ID ${userId} not found`,
        );
      }
      throw error;
    }
  }

  async remove(userId: number) {
    try {
      return await this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `User with ID ${userId} not found`,
        );
      }
      throw error;
    }
  }

  async findOne(userId: number) {
    const user =
      await this.prisma.user.findUnique({
        where: { id: userId },
      });
    return user;
  }

  async findAll(
    role: Role,
    environmentId?: number,
  ) {
    const whereClause: any = {};
    if (role) {
      whereClause.role = role;
    }
    if (environmentId) {
      whereClause.environmentId = environmentId;
    }
    return this.prisma.user.findMany({
      where: whereClause,
    });
  }
}
