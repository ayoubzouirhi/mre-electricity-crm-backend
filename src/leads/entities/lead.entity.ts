import {
  ObjectType,
  Field,
  Int,
} from '@nestjs/graphql';
import { LeadHistory } from './lead-history';
import { LeadChecklistResponse } from 'src/lead-checklist-responses/entities/lead-checklist-response.entity';

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

  @Field(() => Int, { nullable: true })
  stepId?: number;

  @Field()
  source: string;

  @Field(() => Int, {nullable: true})
  environmentId?: number;

  @Field(() => Int, { nullable: true })
  agentId?: number;

  @Field(() => [LeadChecklistResponse], { nullable: true })
  leadChecklistResponses?: LeadChecklistResponse[];

  @Field(() => [LeadHistory], { nullable: true })
  histories?: LeadHistory[];
}
