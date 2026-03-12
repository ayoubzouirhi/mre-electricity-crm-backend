import {
  ObjectType,
  Field,
  Int,
} from '@nestjs/graphql';
import { LeadHistory } from './lead-history';

@ObjectType()
export class Lead {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  email?: string;

  @Field()
  phone: string;

  @Field()
  status: string;

  @Field()
  source: string;

  @Field(() => Int, {nullable: true})
  environmentId: number;

  @Field(() => Int, { nullable: true })
  agentId?: number;

  @Field(() => [LeadHistory], { nullable: true })
  histories?: LeadHistory[];
}
