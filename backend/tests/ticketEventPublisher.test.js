import { describe, expect, it, vi } from 'vitest';
import { TicketEventPublisher } from '../src/queues/ticketEventPublisher.js';

describe('TicketEventPublisher', () => {
  it('publica evento em exchange topic com mensagem persistente', async () => {
    const channel = {
      publish: vi.fn(() => true)
    };
    const publisher = new TicketEventPublisher({
      getChannel: async () => channel,
      exchange: 'ticket.events'
    });

    const published = await publisher.publish('ticket_created', {
      ticketId: 'ticket-1',
      title: 'Novo chamado'
    });

    expect(published).toBe(true);
    expect(channel.publish).toHaveBeenCalledWith(
      'ticket.events',
      'ticket.created',
      expect.any(Buffer),
      {
        contentType: 'application/json',
        persistent: true
      }
    );

    const payload = JSON.parse(channel.publish.mock.calls[0][2].toString('utf8'));
    expect(payload).toMatchObject({
      type: 'ticket_created',
      payload: {
        ticketId: 'ticket-1',
        title: 'Novo chamado'
      }
    });
    expect(payload.occurredAt).toEqual(expect.any(String));
  });

  it('nao publica quando RabbitMQ nao esta configurado', async () => {
    const publisher = new TicketEventPublisher({
      getChannel: async () => null
    });

    await expect(
      publisher.publish('ticket_created', { ticketId: 'ticket-1' })
    ).resolves.toBe(false);
  });
});
