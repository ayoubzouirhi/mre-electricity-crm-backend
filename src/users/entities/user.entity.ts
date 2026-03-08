import {
  ObjectType,
  Field,
  Int,
} from '@nestjs/graphql';
import { Role } from 'src/auth/enums';

@ObjectType()
export class User {
  @Field(() => Int, {
    description: 'Example field (placeholder)',
  })
  id: number;

  @Field()
  email: string;

  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Int, { nullable: true })
  environmentId?: number;
}
