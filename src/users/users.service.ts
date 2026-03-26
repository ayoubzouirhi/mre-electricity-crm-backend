import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Role } from 'src/auth/enums';
import { Prisma, User } from '@prisma/client';

const userSelect = {
  id: true,
  email: true,
  firstname: true,
  lastname: true,
  role: true,
  environmentId: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserInput: CreateUserInput,
    superUser: User,
  ) {
    const {
      password,
      environmentId,
      ...userData
    } = createUserInput;
    let finalEnvironmentId: number;
    if (superUser.role === Role.ADMIN) {
      finalEnvironmentId =
        superUser.environmentId;
      if (
        createUserInput.role === superUser.role
      ) {
        throw new ForbiddenException(
          'Access denied',
        );
      }
    } else {
      finalEnvironmentId =
        environmentId || undefined;
    }
    const hash = await argon2.hash(password);
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        hash,
        environmentId:
          finalEnvironmentId || undefined,
      },
      select: userSelect,
    });
    return user;
  }

  async update(
    updateUserInput: UpdateUserInput,
    targetUserId: number,
    superUser: User,
  ) {
    const {
      password,
      environmentId,
      ...restData
    } = updateUserInput;
    const dataToUpdate: Prisma.UserUpdateInput = {
      ...restData,
    };
    if (password) {
      dataToUpdate.hash =
        await argon2.hash(password);
    }
    const notSuperUser =
      await this.prisma.user.findUnique({
        where: {
          id: targetUserId,
        },
      });
    if (superUser.role === Role.ADMIN) {
      if (
        updateUserInput.role ===
          (superUser.role || Role.SUPER_ADMIN) ||
        notSuperUser?.role === Role.ADMIN ||
        notSuperUser?.role === Role.SUPER_ADMIN
      ) {
        throw new ForbiddenException(
          'Access denied',
        );
      }
    }
    const user = await this.prisma.user.update({
      where: { id: targetUserId },
      data: dataToUpdate,
      select: userSelect,
    });
    return user;
  }

  async remove(userId: number) {
    return await this.prisma.user.delete({
      where: { id: userId },
      select: userSelect,
    });
  }

  async findOne(userId: number) {
    const user =
      await this.prisma.user.findUnique({
        where: { id: userId },
        select: userSelect,
      });
    return user;
  }

  async findAll(
    role: Role,
    environmentId?: number,
  ) {
    const whereClause: Prisma.UserWhereInput = {};
    if (role) {
      whereClause.role = role;
    }
    if (environmentId) {
      whereClause.environmentId = environmentId;
    }
    return this.prisma.user.findMany({
      where: whereClause,
      select: userSelect,
    });
  }
}
