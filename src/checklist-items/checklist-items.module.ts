import { Module } from '@nestjs/common';
import { ChecklistItemsService } from './checklist-items.service';
import { ChecklistItemsResolver } from './checklist-items.resolver';

@Module({
  providers: [ChecklistItemsResolver, ChecklistItemsService],
})
export class ChecklistItemsModule {}
