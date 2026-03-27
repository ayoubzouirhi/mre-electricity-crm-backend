import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsResolver } from './leads.resolver';
import { BullModule } from '@nestjs/bullmq';
import { EmailsProcessor } from './emails.processor';
import { MailService } from './mail.service';

@Module({
  providers: [LeadsResolver, LeadsService, EmailsProcessor, MailService],
  imports: [
    BullModule.registerQueue({
      name: 'emails',
    }),
  ],
})
export class LeadsModule {}
