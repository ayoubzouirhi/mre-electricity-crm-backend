import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDb() {
    return this.$transaction(async () => {
      // Delete child records first (FK constraints)
       this.leadChecklistResponse.deleteMany();
       this.leadDocument.deleteMany();
       this.leadHistory.deleteMany();
       this.ticket.deleteMany();

      // Delete intermediate tables
      this.checklistItem.deleteMany();
       this.documentRequirement.deleteMany();

      // Delete top-level entities
      this.lead.deleteMany();
      this.workflowStep.deleteMany();
      this.user.deleteMany();
      this.environment.deleteMany();
    });
  }
}