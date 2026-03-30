import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class SignupInput {
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  password: string;
}
