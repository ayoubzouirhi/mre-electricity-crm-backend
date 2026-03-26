import {
  InputType,
  Field,
  Int,
} from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Role } from 'src/auth/enums';

@InputType()
export class CreateUserInput {
  @IsEmail(
    {},
    { message: 'Invalid email address' },
  )
  @IsNotEmpty()
  @Field()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6, {
    message:
      'Password must be at least 6 characters long',
  })
  password: string;

  @Field(() => Role, { nullable: true })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsInt()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  environmentId?: number;
}
