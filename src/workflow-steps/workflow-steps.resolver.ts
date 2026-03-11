import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
} from '@nestjs/graphql';
import { WorkflowStepsService } from './workflow-steps.service';
import { WorkflowStep } from './entities/workflow-step.entity';
import { CreateWorkflowStepInput } from './dto/create-workflow-step.input';
import { UpdateWorkflowStepInput } from './dto/update-workflow-step.input';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UseGuards } from '@nestjs/common';
import {
  CurrentEnv,
  Roles,
} from 'src/auth/decorator';
import { Role } from '@prisma/client';

@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@Resolver(() => WorkflowStep)
export class WorkflowStepsResolver {
  constructor(
    private readonly workflowStepsService: WorkflowStepsService,
  ) {}

  @Mutation(() => WorkflowStep)
  createWorkflowStep(
    @Args('createWorkflowStepInput')
    createWorkflowStepInput: CreateWorkflowStepInput,
    @CurrentEnv() envId: number,
  ) {
    return this.workflowStepsService.create(
      createWorkflowStepInput,
      envId,
    );
  }

  @Query(() => [WorkflowStep], {
    name: 'workflowSteps',
  })
  findAll(@CurrentEnv() envId: number) {
    return this.workflowStepsService.findAll(
      envId,
    );
  }

  @Query(() => WorkflowStep, {
    name: 'workflowStep',
  })
  findOne(
    @Args('id', { type: () => Int })
    stepId: number,
    @CurrentEnv() envId?: number,
  ) {
    return this.workflowStepsService.findOne(
      stepId,
      envId,
    );
  }

  @Mutation(() => WorkflowStep)
  updateWorkflowStep(
    @Args('updateWorkflowStepInput')
    updateWorkflowStepInput: UpdateWorkflowStepInput,
    @Args('id', { type: () => Int })
    stepId: number,
    @CurrentEnv() envId?: number,
  ) {
    return this.workflowStepsService.update(
      updateWorkflowStepInput,
      stepId,
      envId,
    );
  }

  @Mutation(() => WorkflowStep)
  removeWorkflowStep(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.workflowStepsService.remove(id);
  }
}
