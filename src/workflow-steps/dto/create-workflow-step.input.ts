import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateWorkflowStepInput {

  @IsNotEmpty({ message: 'Name is required' })
  @Field()
  name: string;

  @IsOptional()
  @Field({ nullable: true })
  color?: string;

  @IsNotEmpty({ message: 'Order is required' })
  @Field(() => Int)
  order: number;

  @IsOptional()
  @Field()
  isFinal?: boolean;

}
