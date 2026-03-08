import {
  InputType,
  Field,
} from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateEnvironmentInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsOptional()
  @Field({ nullable: true })
  description?: string;
}
