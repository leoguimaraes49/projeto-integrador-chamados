import { env } from '../config/env.js';
import { getRabbitChannel } from './rabbitmq.js';

export class TicketEventPublisher {
  constructor({
    getChannel = getRabbitChannel,
    exchange = env.rabbitmq.ticketEventsExchange
  } = {}) {
    this.getChannel = getChannel;
    this.exchange = exchange;
  }

  async publish(type, payload) {
    const channel = await this.getChannel();
    if (!channel) {
      return false;
    }

    const message = {
      type,
      occurredAt: new Date().toISOString(),
      payload
    };

    return channel.publish(
      this.exchange,
      toRoutingKey(type),
      Buffer.from(JSON.stringify(message)),
      {
        contentType: 'application/json',
        persistent: true
      }
    );
  }
}

function toRoutingKey(type) {
  return `ticket.${String(type).replace(/^ticket_/, '').replaceAll('_', '.')}`;
}
