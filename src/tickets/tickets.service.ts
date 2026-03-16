import { Injectable } from '@nestjs/common';
import { CreateTicketInput } from './dto/create-ticket.input';
import { UpdateTicketInput } from './dto/update-ticket.input';

@Injectable()
export class TicketsService {
  create(
    createTicketInput: CreateTicketInput,
    creatorId: number,
    envId: number,
  ) {

    return ;
  }

  findAll() {
    return `This action returns all tickets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(
    id: number,
    updateTicketInput: UpdateTicketInput,
  ) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
