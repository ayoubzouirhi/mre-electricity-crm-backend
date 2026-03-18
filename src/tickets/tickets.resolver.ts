import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
} from '@nestjs/graphql';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { Get, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role, User } from '@prisma/client';
import {
  CurrentEnv,
  GetUser,
  Roles,
} from 'src/auth/decorator';

@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.RESPONSABLE, Role.AGENT)
@Resolver(() => Ticket)
export class TicketsResolver {
  constructor(
    private readonly ticketsService: TicketsService,
  ) {}

  @Mutation(() => Ticket)
  createTicket(
    @Args('createTicketInput')
    createTicketInput: CreateTicketInput,
    @GetUser('id') creatorId: number,
    @CurrentEnv() envId: number,
  ) {
    return this.ticketsService.create(
      createTicketInput,
      creatorId,
      envId,
    );
  }

  @Roles(Role.ADMIN, Role.RESPONSABLE, Role.AGENT)
  @Query(() => [Ticket], { name: 'tickets' })
  findAll(
    @CurrentEnv() envId: number,
    @GetUser() user: User,
  ) {
    return this.ticketsService.findAll(
      envId,
      user,
    );
  }

  @Roles(Role.ADMIN, Role.RESPONSABLE, Role.AGENT)
  @Query(() => Ticket, { name: 'ticket' })
  findOne(
    @Args('id', { type: () => Int })
    ticketId: number,
    @CurrentEnv() envId: number,
    @GetUser() user: User,
  ) {
    return this.ticketsService.findOne(
      ticketId,
      envId,
      user,
    );
  }

  @Roles(Role.ADMIN, Role.RESPONSABLE, Role.AGENT)
  @Mutation(() => Ticket)
  updateTicket(
    @Args('updateTicketInput')
    updateTicketInput: UpdateTicketInput,
    @Args('id', { type: () => Int })
    ticketId: number,
    @CurrentEnv() envId: number,
    @GetUser() user: User,
  ) {
    return this.ticketsService.update(
      ticketId,
      updateTicketInput,
      envId,
      user,
    );
  }

  @Roles(Role.ADMIN, Role.RESPONSABLE)
  @Mutation(() => Ticket)
  removeTicket(
    @Args('id', { type: () => Int })
    ticketId: number,
    @CurrentEnv() envId: number,
  ) {
    return this.ticketsService.remove(
      ticketId,
      envId,
    );
  }
}
