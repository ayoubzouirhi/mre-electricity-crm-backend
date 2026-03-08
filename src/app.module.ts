import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EnvironmentsModule } from './environments/environments.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), 
      playground: true, 
      context: ({ req }) => {
        const envId = req.headers['x-environment-id'];
        return {
          req,
          enviromentId: envId ? parseInt(envId as string, 10) : null,
        }
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    UsersModule,
    PrismaModule,
    AuthModule,
    EnvironmentsModule,
  ],
})
export class AppModule {}