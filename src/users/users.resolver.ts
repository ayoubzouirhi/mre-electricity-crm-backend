import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User as GqlUser } from './entities/user.entity';
import { User as PrismaUser } from '@prisma/client';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { CurrentEnv, GetUser } from 'src/common/decorator';
import { Roles } from 'src/common/decorator/roles.decorators';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role } from '@prisma/client';

@UseGuards(GqlAuthGuard, RolesGuard)
@Resolver(() => GqlUser)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => GqlUser)
  createUser(
    @Args('createUserInput')
    createUserInput: CreateUserInput,
    @GetUser() superUser: PrismaUser,
  ) {
    return this.usersService.create(createUserInput, superUser);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Query(() => GqlUser, { name: 'me' })
  getMe(@GetUser() user: PrismaUser) {
    return user;
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Mutation(() => GqlUser, { name: 'updateUser' })
  updateUser(
    @Args('id', { type: () => Int })
    targetUserId: number,
    @Args('updateUserInput')
    updateUserInput: UpdateUserInput,
    @GetUser() superUser: PrismaUser,
  ) {
    return this.usersService.update(updateUserInput, targetUserId, superUser);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Mutation(() => GqlUser, { name: 'removeUser' })
  removeUser(
    @Args('id', { type: () => Int })
    targetUserId: number,
  ) {
    return this.usersService.remove(targetUserId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Query(() => GqlUser, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Query(() => [GqlUser], { name: 'users' })
  findAll(@Args('role', { nullable: true }) role?: Role, @CurrentEnv() envId?: number) {
    return this.usersService.findAll(role, envId);
  }
}
