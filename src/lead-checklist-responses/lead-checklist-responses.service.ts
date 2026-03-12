import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeadChecklistResponseInput } from './dto/create-lead-checklist-response.input';
import { UpdateLeadChecklistResponseInput } from './dto/update-lead-checklist-response.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeadChecklistResponsesService {
  constructor(private prisma: PrismaService) {}
  async toggleCheckList(
    input: CreateLeadChecklistResponseInput,
    envId: number,
  ) {
    const leadExists =
      await this.prisma.lead.findFirst({
        where: {
          id: input.leadId,
          environmentId: envId,
        },
      });

    if (!leadExists) {
      throw new NotFoundException(
        'Lead introuvable ou accès refusé',
      );
    }
    return this.prisma.leadChecklistResponse.upsert(
      {
        where: {
          leadId_checklistItemId: {
            leadId: input.leadId,
            checklistItemId:
              input.checklistItemId,
          },
        },
        update: {
          isChecked: input.isChecked,
        },
        create: {
          ...input,
        },
      },
    );
  }

  async findByLead(
    leadId: number,
    envId: number,
  ) {
    const leadExists =
      await this.prisma.lead.findFirst({
        where: {
          id: leadId,
          environmentId: envId,
        },
      });
    if (!leadExists)
      throw new NotFoundException(
        'Lead introuvable',
      );
    return this.prisma.leadChecklistResponse.findMany(
      {
        where: {
          leadId,
        },
      },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} leadChecklistResponse`;
  }

  remove(id: number) {
    return `This action removes a #${id} leadChecklistResponse`;
  }
}
