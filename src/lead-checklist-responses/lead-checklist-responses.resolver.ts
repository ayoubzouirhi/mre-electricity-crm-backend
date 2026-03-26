import { Role } from 'src/auth/enums';
import { Roles } from '../common/decorator/roles.decorators';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LeadChecklistResponsesService } from './lead-checklist-responses.service';
import { LeadChecklistResponse } from './entities/lead-checklist-response.entity';
import { CreateLeadChecklistResponseInput } from './dto/create-lead-checklist-response.input';
import { UpdateLeadChecklistResponseInput } from './dto/update-lead-checklist-response.input';
import { CurrentEnv } from 'src/common/decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@UseGuards(GqlAuthGuard, RolesGuard)
@Resolver(() => LeadChecklistResponse)
export class LeadChecklistResponsesResolver {
  constructor(private readonly leadChecklistResponsesService: LeadChecklistResponsesService) {}

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.AGENT)
  @Mutation(() => LeadChecklistResponse)
  toggleLeadCheckListResponses(
    @Args('createLeadChecklistResponseInput')
    createLeadChecklistResponseInput: CreateLeadChecklistResponseInput,
    @CurrentEnv() envId: number,
  ) {
    return this.leadChecklistResponsesService.toggleCheckListResponses(
      createLeadChecklistResponseInput,
      envId,
    );
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.AGENT)
  @Query(() => [LeadChecklistResponse], {
    name: 'leadChecklistResponses',
  })
  findByLead(
    @Args('leadId', { type: () => Int })
    leadId: number,
    @CurrentEnv() envId: number,
  ) {
    return this.leadChecklistResponsesService.findByLead(leadId, envId);
  }

  @Query(() => LeadChecklistResponse, {
    name: 'leadChecklistResponse',
  })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.leadChecklistResponsesService.findOne(id);
  }

  @Mutation(() => LeadChecklistResponse)
  removeLeadChecklistResponse(@Args('id', { type: () => Int }) id: number) {
    return this.leadChecklistResponsesService.remove(id);
  }
}
