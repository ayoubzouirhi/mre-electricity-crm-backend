import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);
  constructor(private ConfigService: ConfigService) {
    this.resend = new Resend(this.ConfigService.get<string>('RESEND_API_KEY'));
  }
  async sendWhelcomeEmail(email: string, name: string) {
    try {
      await this.resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to Mre Electricity CRM',
        html: `<strong>Hi ${name},</strong><br>Welcome to our platform! We are glad to have you.`,
      });
      this.logger.log(`Email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${email}: ${error}`);
      throw error;
    }
  }
}
