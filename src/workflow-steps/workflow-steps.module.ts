import { Module } from '@nestjs/common';
import { WorkflowStepsService } from './workflow-steps.service';
import { WorkflowStepsResolver } from './workflow-steps.resolver';

@Module({
  providers: [WorkflowStepsResolver, WorkflowStepsService],
})
export class WorkflowStepsModule {}
