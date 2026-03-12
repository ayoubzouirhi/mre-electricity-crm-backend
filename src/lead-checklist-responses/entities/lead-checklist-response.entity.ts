import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LeadChecklistResponse {
  @Field(() => Int)
  id: number;

  @Field()
  isChecked: boolean;

  @Field(() => Int)
  leadId: number;

  @Field(() => Int)
  checklistItemId: number;
}
