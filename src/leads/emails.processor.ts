import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from './mail.service';

@Processor('emails')
export class EmailsProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailsProcessor.name);
  constructor(private mailService: MailService) {
    super();
  }
  async process(job: Job): Promise<any> {
    this.logger.log(`Start processing job [${job.name}] (ID: ${job.id})...`);
    switch (job.name) {
      case 'send-welcome-email':
        await this.handleWelcomeEmail(job.data);
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
    this.logger.log(`Finished processing job [${job.name}] (ID: ${job.id})...`);
  }
  private async handleWelcomeEmail(data: any) {
    const { email, firstname, leadId } = data;
    this.logger.log(`Sending welcome email to ${data.email}....`);
    await this.mailService.sendWhelcomeEmail(email, firstname);
    this.logger.debug(`Welcome email sent to ${email}`);
  }
}
