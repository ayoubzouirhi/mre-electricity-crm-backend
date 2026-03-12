import { ChecklistItem } from './../../node_modules/.prisma/client/index.d';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChecklistItemInput } from './dto/create-checklist-item.input';
import { UpdateChecklistItemInput } from './dto/update-checklist-item.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChecklistItemsService {
  constructor(private prisma: PrismaService) {}
  async create(
    createChecklistItemInput: CreateChecklistItemInput,
    envId: number,
  ) {
    const envIdExist =
      await this.prisma.environment.findUnique({
        where: { id: envId },
      });
    if (!envIdExist) {
      throw new NotFoundException(
        `Environment ID: ${envId} does not exist`,
      );
    }
    const stepIdExist =
      await this.prisma.workflowStep.findFirst({
        where: {
          id: createChecklistItemInput.stepId,
          environmentId: envId,
        },
      });
    if (!stepIdExist) {
      throw new NotFoundException(
        `Workflow Step ID: ${createChecklistItemInput.stepId} does not exist `,
      );
    }
    return await this.prisma.checklistItem.create(
      {
        data: {
          ...createChecklistItemInput,
        },
      },
    );
  }

  findAll() {
    return `This action returns all checklistItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} checklistItem`;
  }

  update(
    id: number,
    updateChecklistItemInput: UpdateChecklistItemInput,
  ) {
    return `This action updates a #${id} checklistItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} checklistItem`;
  }
}
