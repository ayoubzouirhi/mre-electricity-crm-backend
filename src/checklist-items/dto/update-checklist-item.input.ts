import { CreateChecklistItemInput } from './create-checklist-item.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateChecklistItemInput extends PartialType(CreateChecklistItemInput) {
  @Field(() => Int)
  id: number;
}
