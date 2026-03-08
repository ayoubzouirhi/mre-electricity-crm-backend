import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Get, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import {
  CurrentEnv,
  GetUser,
} from 'src/auth/decorator';
import { Roles } from 'src/auth/decorator/roles.decorators';
import { Role } from 'src/auth/enums';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => User)
  createUser(
    @Args('createUserInput')
    createUserInput: CreateUserInput,
  ) {
    return this.usersService.create(
      createUserInput,
    );
  }

  @Query(() => User, { name: 'me' })
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(RolesGuard)
  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput')
    updateUserInput: UpdateUserInput,
    @GetUser('id') user: number,
  ) {
    return this.usersService.update(
      updateUserInput,
      user,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => User, { name: 'removeUser' })
  removeUser(
    @Args('id', { type: () => Int })
    targetUserId: number,
  ) {
    return this.usersService.remove(targetUserId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.usersService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [User], { name: 'users' })
  findAll(
    @Args('role', { nullable: true }) role?: Role,
    @CurrentEnv() envId?: number,
  ) {
    return this.usersService.findAll(role, envId);
  }
}
