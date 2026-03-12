import {
  InputType,
  Int,
  Field,
} from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateLeadInput {
  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;

  @Field({ nullable: true })
  @IsOptional()
  email?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Field({ nullable: true })
  @IsOptional()
  stepId?: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  source: string;
}
