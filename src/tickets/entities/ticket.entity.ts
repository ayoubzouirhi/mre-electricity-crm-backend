import { Environment } from './../../environments/entities/environment.entity';
import {
  ObjectType,
  Field,
  Int,
} from '@nestjs/graphql';

@ObjectType()
export class Ticket {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ defaultValue: 'OPEN' })
  status?: string;

  @Field({ nullable: true })
  priority?: string;

  @Field(() => Date, { nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  environmentId?: number;

  @Field({ nullable: true })
  leadId?: number;

  @Field({ nullable: true })
  assigneeId?: number;

  @Field(() => Int, { nullable: true })
  creatorId?: number;
}
