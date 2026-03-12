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

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createLeadInput: CreateLeadInput,
    envId: number,
    userId: number,
  ) {
    if (!envId) {
      throw new BadRequestException(
        'Environment ID is required',
      );
    }
    const envExist =
      await this.prisma.environment.findUnique({
        where: { id: envId },
      });
    if (!envExist) {
      throw new NotFoundException(
        `Environment ID: ${envId} does not exist`,
      );
    }
    const orConditions: any[] = [
      { phone: createLeadInput.phone },
    ];
    if (createLeadInput.email) {
      orConditions.push({
        email: createLeadInput.email,
      });
    }
    const existingLead =
      await this.prisma.lead.findFirst({
        where: {
          OR: orConditions,
        },
      });
    if (existingLead) {
      throw new ConflictException(
        `Lead with this phone or email already exists: ${existingLead.phone || existingLead.email}`,
      );
    }

    return this.prisma.lead.create({
      data: {
        ...createLeadInput,
        environmentId: envId,
        agentId: userId,
      },
    });
  }

  async findAll(envId: number, user?: User) {
    if (!envId) {
      throw new BadRequestException(
        'Environment ID is required',
      );
    }
    const envIdExist =
      await this.prisma.environment.findUnique({
        where: {
          id: envId,
        },
      });
    if (!envIdExist) {
      throw new BadRequestException(
        `Environment ID: ${envId} does not exist`,
      );
    }
    const whereClause: any = {
      environmentId: envId,
    };
    if (user.role === 'AGENT') {
      whereClause.OR = [
        { agentId: user.id },
        { status: 'NEW', agentId: null },
      ];
    }
    return this.prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(
    user: User,
    envId: number,
    leadId: number,
  ) {
    if (!envId || !leadId) {
      throw new BadRequestException(
        'Lead ID and Environment ID are required',
      );
    }
    const envIdExist =
      await this.prisma.environment.findUnique({
        where: {
          id: envId,
        },
      });
    if (!envIdExist) {
      throw new BadRequestException(
        `Environment ID: ${envId} does not exist`,
      );
    }
    const whereClause: any = {
      id: leadId,
      environmentId: envId,
    };
    if (user.role === 'AGENT') {
      whereClause.OR = [
        { agentId: user.id },
        { status: 'NEW', agentId: null },
      ];
    }
    const leadAccessedByUser =
      await this.prisma.lead.findFirst({
        where: whereClause,
      });
    if (!leadAccessedByUser) {
      throw new BadRequestException(
        `Access denied for this lead ID: ${leadId}`,
      );
    }
    return leadAccessedByUser;
  }

  async update(
    updateLeadInput: UpdateLeadInput,
    user: User,
    leadId: number,
  ) {
    console.log(`LeadId:  ${leadId}`);
    if (!leadId || leadId <= 0) {
      throw new BadRequestException(
        'Lead ID is required',
      );
    }
    const existingLead =
      await this.prisma.lead.findUnique({
        where: { id: leadId },
      });

    const whereClause: any = { id: leadId };

    if (user.role === 'AGENT') {
      whereClause.OR = [
        { agentId: user.id },
        { status: 'NEW', agentId: null },
      ];
    }
    if (!existingLead) {
      throw new BadRequestException(
        'Lead does not exist or you do not have permission to update it',
      );
    }
    const { phone, agentId, ...agentSafeData } =
      updateLeadInput;
    const dataToUpdate =
      user.role === 'AGENT'
        ? agentSafeData
        : updateLeadInput;
    return this.prisma.lead.update({
      where: whereClause,
      data: {
        ...dataToUpdate,
        histories: {
          create: {
            action: `Updated lead ${leadId}`,
            oldValue: dataToUpdate.status,
            newValue: dataToUpdate.status,
            userId: user.id,
          },
        },
      },
      include: {
        histories: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async remove(leadId: number, user: User) {
    const lead = await this.prisma.lead.findFirst(
      {
        where: {
          id: leadId,
        },
      },
    );

    if (!lead) {
      throw new NotFoundException(
        'Lead does not exist or you do not have permission to delete it',
      );
    }
    return this.prisma.lead.delete({
      where: {
        id: leadId,
      },
    });
  }
}
