import {
  Field,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class LeadHistory {
  @Field(() => Int)
  id: number;

  @Field()
  createdAt: Date;

  @Field()
  action: string;

  @Field({ nullable: true })
  oldValue?: string;

  @Field({ nullable: true })
  newValue?: string;

  @Field(() => Int, { nullable: true })
  userId?: number;
}
