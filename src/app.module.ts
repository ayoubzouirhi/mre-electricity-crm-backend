import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EnvironmentsModule } from './environments/environments.module';
import { LeadsModule } from './leads/leads.module';
import { WorkflowStepsModule } from './workflow-steps/workflow-steps.module';
import { ChecklistItemsModule } from './checklist-items/checklist-items.module';
import { LeadChecklistResponsesModule } from './lead-checklist-responses/lead-checklist-responses.module';
import { TicketsModule } from './tickets/tickets.module';
import { BullModule } from '@nestjs/bullmq';
import { config } from 'process';
import { WebhooksModule } from './webhooks/webhooks.module';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardResolver } from './dashboard/dashboard.resolver';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      installSubscriptionHandlers: true,
      context: ({ req }) => {
        const envIdRaw = req.headers['x-environment-id'];
        const envId = envIdRaw ? parseInt(envIdRaw as string, 10) : null;
        return {
          req,
          environmentId: isNaN(envId) ? null : envId,
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    EnvironmentsModule,
    LeadsModule,
    WorkflowStepsModule,
    ChecklistItemsModule,
    LeadChecklistResponsesModule,
    TicketsModule,
    WebhooksModule,
    DashboardModule,
  ],
})
export class AppModule {}
