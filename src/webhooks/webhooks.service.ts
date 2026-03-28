import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}
  async processCallEnded(payload: any) {
    if (!payload || typeof payload !== 'object') {
      console.error('Ringover webhook received an invalid payload: ', payload);
      throw new BadRequestException('Invalid request body. Payload must be a non-empty object.');
    }

    const { caller_number, agent_email } = payload;

    if (!caller_number || !agent_email) {
      console.error('Ringover webhook received payload with missing required fields: ', payload);
      throw new BadRequestException(
        'Malformed Ringover webhook payload. Missing required fields (caller_number, agent_email,).',
      );
    }
    const agent = await this.prisma.user.findUnique({
      where: { email: agent_email },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    let lead = await this.prisma.lead.findFirst({
      where: {
        phone: caller_number,
        environmentId: agent.environmentId,
      },
    });

    if (!lead) {
      lead = await this.prisma.lead.create({
        data: {
          phone: caller_number,
          environmentId: agent.environmentId,
          source: 'RINGOVER_AUTO',
        },
      });
    }
    return { status: 'success', leadId: lead.id };
  }
}
