import { Module } from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsResolver } from './environments.resolver';

@Module({
  providers: [EnvironmentsResolver, EnvironmentsService],
})
export class EnvironmentsModule {}
