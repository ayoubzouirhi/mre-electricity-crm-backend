import {
  IsInt,
  IsOptional,
} from 'class-validator';
import { CreateLeadInput } from './create-lead.input';
import {
  InputType,
  Field,
  PartialType,
  Int,
} from '@nestjs/graphql';

@InputType()
export class UpdateLeadInput extends PartialType(
  CreateLeadInput,
) {
  @Field({ nullable: true })
  @IsOptional()
  stepId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  agentId?: number;
}
