import { env } from '../config/env.js';
import { closeRabbitConnection, getRabbitChannel } from '../queues/rabbitmq.js';
import { logger } from '../utils/logger.js';

async function run() {
  if (!env.amqpUrl) {
    logger.warn('notification_worker_disabled', { reason: 'AMQP_URL ausente' });
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

  logger.info('notification_worker_started', {
    queue: env.rabbitmq.notificationQueue
  });

  await channel.consume(env.rabbitmq.notificationQueue, (message) => {
    if (!message) {
      return;
    }

    try {
      const event = JSON.parse(message.content.toString('utf8'));
      logger.info('notification_processed', formatNotification(event));
      channel.ack(message);
    } catch (error) {
      logger.error('notification_processing_failed', {
        errorMessage: error.message
      });
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

      logger.warn('rabbitmq_connection_retry', { attempt, maxAttempts });
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
  return {
    eventType: event.type,
    ticketId: payload.ticketId ?? null,
    title: payload.title ?? null
  };
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function shutdown() {
  await closeRabbitConnection();
  process.exit(0);
}

try {
  await run();
} catch (error) {
  logger.error('notification_worker_failed', {
    errorMessage: error.message,
    stack: error.stack
  });
  process.exit(1);
}
