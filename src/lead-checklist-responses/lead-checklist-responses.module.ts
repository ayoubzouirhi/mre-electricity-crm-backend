import { Module } from '@nestjs/common';
import { LeadChecklistResponsesService } from './lead-checklist-responses.service';
import { LeadChecklistResponsesResolver } from './lead-checklist-responses.resolver';

@Module({
  providers: [LeadChecklistResponsesResolver, LeadChecklistResponsesService],
})
export class LeadChecklistResponsesModule {}
