import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnvironmentInput } from './dto/create-environment.input';
import { UpdateEnvironmentInput } from './dto/update-environment.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnvironmentsService {
  constructor(private prisma: PrismaService) {}
  async create(
    createEnvironmentInput: CreateEnvironmentInput,
  ) {
    const environment =
      await this.prisma.environment.create({
        data: { ...createEnvironmentInput },
      });
    return environment;
  }

  findAll() {
    return this.prisma.environment.findMany();
  }

  async findOne(environment: number) {
    const envExist =
      await this.prisma.environment.findUnique({
        where: { id: environment },
      });
    if (!envExist) {
      throw new NotFoundException(
        `Environment with ID ${environment} not found`,
      );
    }
    return envExist;
  }

  async update(
    updateEnvironmentInput: UpdateEnvironmentInput,
  ) {
    const { id, ...data } =
      updateEnvironmentInput;

    try {
      return await this.prisma.environment.update(
        {
          where: { id },
          data,
        },
      );
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Environment with ID ${id} not found`,
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.environment.delete(
        {
          where: { id },
        },
      );
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Environment with ID ${id} not found`,
        );
      }
      throw error;
    }
  }
}
