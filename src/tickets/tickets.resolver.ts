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
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import {
  Environment,
  Role,
} from '@prisma/client';
import {
  CurrentEnv,
  GetUser,
  Roles,
} from 'src/auth/decorator';

@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.RESPONSABLE,
)
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

  @Query(() => [Ticket], { name: 'tickets' })
  findAll() {
    return this.ticketsService.findAll();
  }

  @Query(() => Ticket, { name: 'ticket' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.ticketsService.findOne(id);
  }

  @Mutation(() => Ticket)
  updateTicket(
    @Args('updateTicketInput')
    updateTicketInput: UpdateTicketInput,
  ) {
    return this.ticketsService.update(
      updateTicketInput.id,
      updateTicketInput,
    );
  }

  @Mutation(() => Ticket)
  removeTicket(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.ticketsService.remove(id);
  }
}
