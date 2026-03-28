import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LeadsBySource {
  @Field()
  source: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class TicketsByStatus {
  @Field()
  status: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class DashboardStats {
  @Field(() => Int)
  totalLeads: number;

  @Field(() => Int)
  leadsCreatedThisMonth: number;

  @Field(() => [LeadsBySource])
  leadsBySource: LeadsBySource[];

  @Field(() => Int)
  totalTickets: number;

  @Field(() => Int)
  openTickets: number;

  @Field(() => [TicketsByStatus])
  ticketsByStatus: TicketsByStatus[];
}