import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role, User } from '@prisma/client';
import { CurrentEnv, GetUser, Roles } from 'src/common/decorator';
import { PaginationArgs } from 'src/common/pagination.args';

@UseGuards(GqlAuthGuard, RolesGuard)
@Resolver(() => Ticket)
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) {}

  @Roles(Role.ADMIN, Role.RESPONSABLE, Role.AGENT)
  @Mutation(() => Ticket)
  createTicket(
    @Args('createTicketInput')
    createTicketInput: CreateTicketInput,
    @GetUser() creatorUser: User,
    @CurrentEnv() envId: number,
  ) {
    return this.ticketsService.create(createTicketInput, creatorUser, envId);
  }

  @Roles(Role.ADMIN, Role.RESPONSABLE, Role.AGENT)
  @Query(() => [Ticket], { name: 'tickets' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @CurrentEnv() envId: number,
    @GetUser() user: User,
  ) {
    return this.ticketsService.findAll(envId, user, paginationArgs);
  }

  @Roles(Role.ADMIN, Role.RESPONSABLE, Role.AGENT)
  @Query(() => Ticket, { name: 'ticket' })
  findOne(
    @Args('id', { type: () => Int })
    ticketId: number,
    @CurrentEnv() envId: number,
    @GetUser() user: User,
  ) {
    return this.ticketsService.findOne(ticketId, envId, user);
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
    return this.ticketsService.update(ticketId, updateTicketInput, envId, user);
  }

  @Roles(Role.ADMIN, Role.RESPONSABLE)
  @Mutation(() => Ticket)
  removeTicket(
    @Args('id', { type: () => Int })
    ticketId: number,
    @CurrentEnv() envId: number,
  ) {
    return this.ticketsService.remove(ticketId, envId);
  }
}
