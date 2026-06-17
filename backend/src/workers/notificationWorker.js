import { env } from '../config/env.js';
import { closeRabbitConnection, getRabbitChannel } from '../queues/rabbitmq.js';

async function run() {
  if (!env.amqpUrl) {
    console.log('Worker de notificacoes encerrado: AMQP_URL nao configurado.');
    return;
  }

  const channel = await waitForRabbitChannel();
  await channel.assertQueue(env.rabbitmq.notificationQueue, {
    durable: true
  });
  await channel.bindQueue(
    env.rabbitmq.notificationQueue,
    env.rabbitmq.ticketEventsExchange,
    'ticket.#'
  );
  await channel.prefetch(5);

  console.log(
    `Worker de notificacoes aguardando eventos na fila ${env.rabbitmq.notificationQueue}.`
  );

  await channel.consume(env.rabbitmq.notificationQueue, (message) => {
    if (!message) {
      return;
    }

    try {
      const event = JSON.parse(message.content.toString('utf8'));
      console.log(formatNotification(event));
      channel.ack(message);
    } catch (error) {
      console.error('Falha ao processar mensagem RabbitMQ:', error.message);
      channel.nack(message, false, false);
    }
  });
}

async function waitForRabbitChannel() {
  const maxAttempts = 12;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await getRabbitChannel();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      console.log(
        `RabbitMQ ainda nao aceitou conexao. Tentativa ${attempt}/${maxAttempts}.`
      );
      await wait(5000);
    }
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function formatNotification(event) {
  const payload = event.payload ?? {};
  const title = payload.title ? ` - ${payload.title}` : '';

  return `[notificacao] ${event.type}${title} (${payload.ticketId ?? 'sem ticketId'})`;
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function shutdown() {
  await closeRabbitConnection();
  process.exit(0);
}

run().catch((error) => {
  console.error('Worker de notificacoes falhou:', error);
  process.exit(1);
});
