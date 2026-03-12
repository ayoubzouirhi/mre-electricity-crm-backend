import {
  ObjectType,
  Field,
  Int,
} from '@nestjs/graphql';

@ObjectType()
export class WorkflowStep {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => Int)
  order: number;

  @Field()
  isFinal: boolean;

  @Field(() => Int)
  environmentId: number;
}
