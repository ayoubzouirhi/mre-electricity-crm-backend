import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChecklistItemsService } from './checklist-items.service';
import { ChecklistItem } from './entities/checklist-item.entity';
import { CreateChecklistItemInput } from './dto/create-checklist-item.input';
import { UpdateChecklistItemInput } from './dto/update-checklist-item.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CurrentEnv, GetUser, Roles } from 'src/common/decorator';
import { Role } from '@prisma/client';

@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@Resolver(() => ChecklistItem)
export class ChecklistItemsResolver {
  constructor(private readonly checklistItemsService: ChecklistItemsService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => ChecklistItem)
  createChecklistItem(
    @Args('createChecklistItemInput')
    createChecklistItemInput: CreateChecklistItemInput,
    @CurrentEnv() envId: number,
  ) {
    return this.checklistItemsService.create(createChecklistItemInput, envId);
  }

  @Query(() => [ChecklistItem], {
    name: 'checklistItems',
  })
  findAll() {
    return this.checklistItemsService.findAll();
  }

  @Query(() => ChecklistItem, {
    name: 'checklistItem',
  })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.checklistItemsService.findOne(id);
  }

  @Mutation(() => ChecklistItem)
  updateChecklistItem(
    @Args('updateChecklistItemInput')
    updateChecklistItemInput: UpdateChecklistItemInput,
  ) {
    return this.checklistItemsService.update(updateChecklistItemInput.id, updateChecklistItemInput);
  }

  @Mutation(() => ChecklistItem)
  removeChecklistItem(@Args('id', { type: () => Int }) id: number) {
    return this.checklistItemsService.remove(id);
  }
}
