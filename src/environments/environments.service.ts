import { Injectable } from '@nestjs/common';
import { CreateEnvironmentInput } from './dto/create-environment.input';
import { UpdateEnvironmentInput } from './dto/update-environment.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnvironmentsService {
  constructor( private prisma: PrismaService){}
  async create(createEnvironmentInput: CreateEnvironmentInput) {
      const environment = await this.prisma.environment.create({
        data: {...createEnvironmentInput}
      })
    return environment;
  }

  findAll() {
    return this.prisma.environment.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} environment`;
  }

  update(updateEnvironmentInput: UpdateEnvironmentInput) {
    return `This action updates a # environment`;
  }

  remove(id: number) {
    return `This action removes a #${id} environment`;
  }
}
