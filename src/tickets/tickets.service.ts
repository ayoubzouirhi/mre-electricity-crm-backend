import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Role, User } from '@prisma/client';
import { PaginationArgs } from 'src/common/pagination.args';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createTicketInput: CreateTicketInput, creator: User, envId: number) {
    if (creator.role === Role.AGENT) {
      if (createTicketInput.assigneeId && creator.id !== createTicketInput.assigneeId) {
        throw new ForbiddenException('Access denied');
      }
    }
    const ticket = this.prisma.ticket.create({
      data: {
        ...createTicketInput,
        creatorId: creator.id,
        environmentId: envId,
      },
    });
    return ticket;
  }

  async findAll(envId: number, user: User, paginationArgs: PaginationArgs) {
    const { take, skip } = paginationArgs;
    const whereClause: Prisma.TicketWhereInput = {
      environmentId: envId,
    };
    if (user.role === Role.AGENT) {
      whereClause.OR = [{ creatorId: user.id }, { assigneeId: user.id }];
    }
    const tickets = await this.prisma.ticket.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });
    if (!tickets.length) {
      throw new NotFoundException(`No tickets found for this environment`);
    }
    return tickets;
  }

  async findOne(ticketId: number, envId: number, user: User) {
    const whereClause: Prisma.TicketWhereInput = {
      id: ticketId,
      environmentId: envId,
    };
    if (user.role === Role.AGENT) {
      whereClause.OR = [{ creatorId: user.id }, { assigneeId: user.id }];
    }
    const ticket = await this.prisma.ticket.findFirst({
      where: whereClause,
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }
    return ticket;
  }

  async update(ticketId: number, updateTicketInput: UpdateTicketInput, envId: number, user: User) {
    const existingTicket = await this.findOne(ticketId, envId, user);
    if (!existingTicket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: updateTicketInput,
    });
  }

  async remove(ticketId: number, envId: number) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        environmentId: envId,
      },
    });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }
    return this.prisma.ticket.delete({
      where: {
        id: ticketId,
      },
    });
  }
}
