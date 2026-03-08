import { CreateEnvironmentInput } from './create-environment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEnvironmentInput extends PartialType(CreateEnvironmentInput) {
  @Field()
  name?: string; 

  @Field({nullable: true})
  description?: string;

}
