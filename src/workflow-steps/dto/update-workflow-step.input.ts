import { IsOptional } from 'class-validator';
import { CreateWorkflowStepInput } from './create-workflow-step.input';
import {
  InputType,
  Field,
  Int,
  PartialType,
} from '@nestjs/graphql';

@InputType()
export class UpdateWorkflowStepInput extends PartialType(
  CreateWorkflowStepInput,
) {
  @IsOptional()
  @Field(() => Int, { nullable: true })
  id?: number;
}
