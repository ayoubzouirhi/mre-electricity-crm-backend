import { Environment } from './../../environments/entities/environment.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Ticket {
  @Field()
    title: string;
  
    @Field()
    id: number;

    @Field()
    description?: string;
  
    @Field({ defaultValue: "OPEN" })
    status?: string;
  
    @Field()
    priority?: string;
  
    @Field(() => Date, { nullable: true })
    dueDate?: Date;
  
    @Field()
    environmentId?: Environment;

    @Field()
    leadId?: number;
  
    @Field()
    assigneeId?: number;

    @Field()
    creatorId?: number;
  }
  

