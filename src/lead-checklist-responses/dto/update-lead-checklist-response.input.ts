import { CreateLeadChecklistResponseInput } from './create-lead-checklist-response.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLeadChecklistResponseInput extends PartialType(CreateLeadChecklistResponseInput) {
  @Field(() => Int)
  id: number;
}
