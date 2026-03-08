import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Environment {
  @Field(() => Int)
  id: number;

  @Field()
  name: string
  
  @Field({nullable: true})
  description?: string
}
