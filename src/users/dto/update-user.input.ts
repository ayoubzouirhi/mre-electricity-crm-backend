import { IsOptional } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import {
  InputType,
  Field,
  PartialType,
} from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(
  CreateUserInput,
) {
  @Field({ nullable: true })
  @IsOptional()
  firstname?: string;

  @Field({ nullable: true })
  @IsOptional()
  lastname?: string;


}
