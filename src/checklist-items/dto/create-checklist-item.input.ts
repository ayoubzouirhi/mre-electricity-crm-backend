import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateChecklistItemInput {

  @Field()
  @IsNotEmpty()
  label: string;

  @Field({defaultValue: true})
  @IsNotEmpty()
  isRequired: boolean;

  @Field(() => Int)
  @IsNotEmpty()
  stepId: number;
}
