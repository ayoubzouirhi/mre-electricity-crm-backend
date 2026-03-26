import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 10 })
  @IsInt()
  @Min(1)
  take: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  skip: number;
}
