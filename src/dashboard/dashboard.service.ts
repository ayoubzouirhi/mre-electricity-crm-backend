import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}
  async getStats(env: number) {
    if (!env) {
      throw new BadRequestException('Environment ID is required');
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalLeads,
      leadsCreatedThisMonth,
      groupedLeadsBySource,
      totalTickets,
      openTickets,
      groupedTicketsByStatus,
    ] = await Promise.all([
      this.prisma.lead.count({ where: { environmentId: env } }),
      this.prisma.lead.count({ where: { environmentId: env, createdAt: { gte: startOfMonth } } }),
      this.prisma.lead.groupBy({
        by: ['source'],
        where: { environmentId: env },
        _count: { id: true },
      }),
      this.prisma.ticket.count({ where: { environmentId: env } }),
      this.prisma.ticket.count({ where: { environmentId: env, status: 'OPEN' } }),
      this.prisma.ticket.groupBy({
        by: ['status'],
        where: { environmentId: env },
        _count: { id: true },
      }),
    ]);
    const leadsBySource = groupedLeadsBySource.map((group) => ({
      source: group.source,
      count: group._count.id,
    }));

    const ticketsByStatus = groupedTicketsByStatus.map((group) => ({
      status: group.status,
      count: group._count.id,
    }));

    return {
      totalLeads,
      leadsCreatedThisMonth,
      leadsBySource,
      totalTickets,
      openTickets,
      ticketsByStatus,
    };
  }
}
