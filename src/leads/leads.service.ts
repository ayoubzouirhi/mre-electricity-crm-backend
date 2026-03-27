import { PaginationArgs } from 'src/common/pagination.args';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeadInput } from './dto/create-lead.input';
import { UpdateLeadInput } from './dto/update-lead.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/users/entities/user.entity';
import { Prisma, Role } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class LeadsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('emails') private emailsQueuee: Queue,
  ) {}

  private async validateWorkflowTransition(leadId: number, newStepId: number) {
    const requiredChecklist = await this.prisma.checklistItem.findMany({
      where: {
        stepId: newStepId,
        isRequired: true,
      },
    });
    if (requiredChecklist.length > 0) {
      const LeadResponses = await this.prisma.leadChecklistResponse.findMany({
        where: {
          leadId: leadId,
          isChecked: true,
          checklistItemId: {
            in: requiredChecklist.map((item) => item.id),
          },
        },
      });
      if (LeadResponses.length < requiredChecklist.length) {
        const missingItems = requiredChecklist.filter(
          (reqItem) => !LeadResponses.some((respItem) => respItem.checklistItemId === reqItem.id),
        );
        const missinglabel = missingItems.map((item) => item.label);
        throw new BadRequestException(
          `Lead ${leadId} is missing required validated checklist items: ${missinglabel.join(', ')}`,
        );
      }
    }
  }

  async create(createLeadInput: CreateLeadInput, envId: number, userId: number) {
    const orConditions: Prisma.LeadWhereInput[] = [{ phone: createLeadInput.phone }];
    if (createLeadInput.email) {
      orConditions.push({
        email: createLeadInput.email,
      });
    }
    const existingLead = await this.prisma.lead.findFirst({
      where: {
        OR: orConditions,
      },
      select: {
        phone: true,
        email: true,
      },
    });
    if (existingLead) {
      throw new ConflictException({
        message: 'Lead already exists',
        reason: existingLead.phone === createLeadInput.phone ? 'PHONE_EXISTS' : 'EMAIL_EXISTS',
        conflictValue:
          existingLead.phone === createLeadInput.phone ? existingLead.phone : existingLead.email,
      });
    }
    const newLead = await this.prisma.lead.create({
      data: {
        ...createLeadInput,
        environmentId: envId,
        agentId: userId,
      },
    });
    if (newLead.email) {
      await this.emailsQueuee.add(
        'send-welcome-email',
        {
          leadId: newLead.id,
          email: newLead.email,
          firstName: newLead.firstName,
        },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        },
      );
    }
    return newLead;
  }

  async findAll(envId: number, user: User, paginationArgs: PaginationArgs) {
    const { skip, take } = paginationArgs;
    const whereClause: Prisma.LeadWhereInput = {
      environmentId: envId,
    };
    if (user.role === Role.AGENT) {
      whereClause.OR = [{ agentId: user.id }, { agentId: null }];
    }
    return this.prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
  }

  async findOne(user: User, envId: number, leadId: number) {
    if (!envId || !leadId) {
      throw new BadRequestException('Lead ID and Environment ID are required');
    }
    const envIdExist = await this.prisma.environment.findUnique({
      where: {
        id: envId,
      },
    });
    if (!envIdExist) {
      throw new BadRequestException(`Environment ID: ${envId} does not exist`);
    }
    const whereClause: Prisma.LeadWhereInput = {
      id: leadId,
      environmentId: envId,
    };
    if (user.role === Role.AGENT) {
      whereClause.OR = [{ agentId: user.id }, { agentId: null }];
    }
    const leadAccessedByUser = await this.prisma.lead.findFirst({
      where: whereClause,
    });
    if (!leadAccessedByUser) {
      throw new BadRequestException(`Access denied for this lead ID: ${leadId}`);
    }
    return leadAccessedByUser;
  }

  async update(updateLeadInput: UpdateLeadInput, user: User, leadId: number, envId: number) {
    const existingLead = await this.prisma.lead.findUnique({
      where: {
        id: leadId,
        environmentId: envId,
      },
    });
    if (!existingLead) {
      throw new BadRequestException(
        'Lead does not exist or you do not have permission to update it',
      );
    }
    if (updateLeadInput.stepId && updateLeadInput.stepId !== existingLead.stepId) {
      await this.validateWorkflowTransition(leadId, updateLeadInput.stepId);
    }
    if (user.role === Role.AGENT) {
      const isMyLead = existingLead.agentId === user.id;
      const isUnassignedLead = existingLead.agentId === null;
      if (!isMyLead && !isUnassignedLead) {
        throw new BadRequestException('You do not have permission to update this lead');
      }
    }
    const { phone, agentId, ...agentSafeData } = updateLeadInput;
    const dataToUpdate = user.role === 'AGENT' ? agentSafeData : updateLeadInput;
    return this.prisma.lead.update({
      where: { id: leadId },
      data: {
        ...dataToUpdate,
        histories: {
          create: {
            action: `Updated lead ${leadId}`,
            oldValue: existingLead.stepId ? `${existingLead.stepId}` : 'null',
            newValue: dataToUpdate.stepId ? `${dataToUpdate.stepId}` : 'null',
            userId: user.id,
          },
        },
      },
      include: {
        leadChecklistResponses: true,
        histories: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async remove(leadId: number, envId: number) {
    const lead = await this.prisma.lead.findFirst({
      where: {
        id: leadId,
      },
    });
    if (!lead) {
      throw new NotFoundException('Lead does not exist or you do not have permission to delete it');
    }
    return this.prisma.lead.delete({
      where: {
        id: leadId,
        environmentId: envId,
      },
    });
  }
}
