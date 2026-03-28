import { Body, Controller, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { ConfigService } from '@nestjs/config';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly webhookService: WebhooksService,
    private readonly configService: ConfigService,
  ) {}

  @Post('ringover/call-ended')
  async handleRingoverCallEnded(
    @Body() payload: any,
    @Headers('authorization') authorization: string,
  ) {
    const RINGOVER_SECRET = this.configService.get<string>('RINGOVER_WEBHOOK_SECRET');
    if (authorization !== RINGOVER_SECRET)
      throw new UnauthorizedException('Invalid Webhook Secret');
    await this.webhookService.processCallEnded(payload);
  }
}
