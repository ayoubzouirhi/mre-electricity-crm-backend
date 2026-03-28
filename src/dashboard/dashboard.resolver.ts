import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { DashboardStats } from './entities/dashboard.entity';
import { CurrentEnv, Roles } from 'src/common/decorator';
import { Role } from '@prisma/client';

@UseGuards(GqlAuthGuard, RolesGuard)
@Resolver(() => DashboardStats)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.RESPONSABLE)
  @Query(() => DashboardStats, { name: 'dashboardStats' })
  getDashboardStats(@CurrentEnv() env: number) {
    return this.dashboardService.getStats(env);
  }
}
