import {
  InputType,
  Int,
  Field,
} from '@nestjs/graphql';
import { Priority } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateTicketInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ defaultValue: 'OPEN' })
  @IsNotEmpty()
  status: string;

  @Field(() => Priority, {
    defaultValue: Priority.P3,
  })
  @IsNotEmpty()
  priority: Priority;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  dueDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  leadId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  assigneeId?: number;
}
