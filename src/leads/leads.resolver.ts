import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { LeadsService } from './leads.service';
import { Lead } from './entities/lead.entity';
import { CreateLeadInput } from './dto/create-lead.input';
import { UpdateLeadInput } from './dto/update-lead.input';
import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CurrentEnv, GetUser, Roles } from 'src/common/decorator';
import { Role } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs } from 'src/common/pagination.args';
import { pubsub } from 'src/common/pubsub';

@Resolver(() => Lead)
export class LeadsResolver {
  constructor(private readonly leadsService: LeadsService) {}

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RESPONSABLE, Role.AGENT)
  @Mutation(() => Lead)
  createLead(
    @Args('createLeadInput')
    createLeadInput: CreateLeadInput,
    @CurrentEnv() envId?: number,
    @GetUser('id') userId?: number,
  ) {
    return this.leadsService.create(createLeadInput, envId, userId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.RESPONSABLE, Role.AGENT)
  @Query(() => [Lead], { name: 'leads' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @CurrentEnv() envId: number,
    @GetUser() user: User,
  ) {
    return this.leadsService.findAll(envId, user, paginationArgs);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.RESPONSABLE, Role.AGENT)
  @Query(() => Lead, { name: 'leadByEnv' })
  findOne(
    @Args('leadId', { type: () => Int })
    leadId: number,
    @GetUser()
    @CurrentEnv()
    envId: number,
    user: User,
  ) {
    return this.leadsService.findOne(user, envId, leadId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.RESPONSABLE, Role.SUPER_ADMIN, Role.AGENT)
  @Mutation(() => Lead)
  updateLead(
    @Args('updateLeadInput')
    updateLeadInput: UpdateLeadInput,
    @Args('id', { type: () => Int }, ParseIntPipe)
    leadId: number,
    @CurrentEnv() envId: number,
    @GetUser() user?: User,
  ) {
    return this.leadsService.update(updateLeadInput, user, leadId, envId);
  }

  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Lead)
  removeLead(
    @Args('id', { type: () => Int }, ParseIntPipe)
    id: number,
    @CurrentEnv() envId: number,
  ) {
    return this.leadsService.remove(id, envId);
  }

  @Subscription(() => Lead, {
    name: 'leadAdded',
    filter: (payload, variables, context) => {
      return true;
    },
  })
  leadAdded() {
    return pubsub.asyncIterableIterator('leadAdded');
  }
}
