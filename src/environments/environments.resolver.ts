import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
} from '@nestjs/graphql';
import { EnvironmentsService } from './environments.service';
import { Environment } from './entities/environment.entity';
import { CreateEnvironmentInput } from './dto/create-environment.input';
import { UpdateEnvironmentInput } from './dto/update-environment.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator';

@UseGuards(GqlAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
@Resolver(() => Environment)
export class EnvironmentsResolver {
  constructor(
    private environmentsService: EnvironmentsService,
  ) {}

  @Mutation(() => Environment)
  createEnvironment(
    @Args('createEnvironmentInput')
    createEnvironmentInput: CreateEnvironmentInput,
  ) {
    return this.environmentsService.create(
      createEnvironmentInput,
    );
  }

  @Query(() => [Environment], {
    name: 'environments',
  })
  findAll() {
    return this.environmentsService.findAll();
  }

  @Query(() => Environment, {
    name: 'environment',
  })
  findOne(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.environmentsService.findOne(id);
  }

  @Mutation(() => Environment)
  updateEnvironment(
    @Args('updateEnvironmentInput')
    updateEnvironmentInput: UpdateEnvironmentInput,
  ) {
    return this.environmentsService.update(
      updateEnvironmentInput.id,
      updateEnvironmentInput,
    );
  }

  @Mutation(() => Environment)
  removeEnvironment(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.environmentsService.remove(id);
  }
}
