import { Ticket } from './entities/ticket.entity';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma/client';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
  create(
    createTicketInput: CreateTicketInput,
    creatorId: number,
    envId: number,
  ) {
    const ticket = this.prisma.ticket.create({
      data: {
        ...createTicketInput,
        creatorId,
        environmentId: envId,
      },
    });
    return ticket;
  }

  async findAll(envId: number, user: User) {
    const whereClause: Prisma.TicketWhereInput = {
      environmentId: envId,
    };
    if (user.role === Role.AGENT) {
      whereClause.OR = [
        { creatorId: user.id },
        { assigneeId: user.id },
      ];
    }
    console.log(envId, user, whereClause);
    const tickets = await this.prisma.ticket.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    if (!tickets.length) {
      throw new NotFoundException(`No tickets found for environment ID ${envId}`);
    }
    return tickets;
  }

  async findOne(ticketId: number, envId: number, user: User) {
    const whereClause: Prisma.TicketWhereInput = {
      id: ticketId,
      environmentId: envId,
    };
    if (user.role === Role.AGENT) {
      whereClause.OR = [
        { creatorId: user.id },
        { assigneeId: user.id },
      ];
    }
    const ticket = await this.prisma.ticket.findFirst({
      where: whereClause
    })
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }
    return ticket;
  }

  async update(
    ticketId: number,
    updateTicketInput: UpdateTicketInput,
    envId: number,
    user: User,
  ) {

    const existingTicket = await this.findOne(ticketId, envId, user);
    if (!existingTicket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found`);
    }
    return this.prisma.ticket.update({
      where: {id: ticketId},
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
