import {
  InputType,
  Int,
  Field,
} from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

@InputType()
export class CreateLeadChecklistResponseInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  leadId: number;

  @IsNotEmpty()
  @Field(() => Int)
  checklistItemId: number;

  @IsNotEmpty()
  @IsBoolean()
  @Field({ defaultValue: false })
  isChecked: boolean;
}
