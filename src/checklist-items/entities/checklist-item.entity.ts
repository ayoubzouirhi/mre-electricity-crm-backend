import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ChecklistItem {
  @Field(() => Int)
  id: number;

  @Field()
  label: string;

  @Field()
  isRequired: boolean;

  @Field(() => Int)
  stepId: number;
}
