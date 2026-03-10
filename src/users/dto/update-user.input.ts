import { IsOptional } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import {
  InputType,
  Field,
  PartialType,
} from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class UpdateUserInput extends PartialType(
  CreateUserInput,
) {
  @Field({ nullable: true })
  @IsOptional()
  firstname?: string;

  @Field()
  @IsOptional()
  lastname?: string;

  @IsOptional()
  @Field(() => Role, { nullable: true })
  role?: Role;
}
