import amqp from 'amqplib';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

let connection = null;
let channel = null;
let channelPromise = null;

export async function getRabbitChannel() {
  if (!env.amqpUrl) {
    return null;
  }

  if (channel) {
    return channel;
  }

  if (!channelPromise) {
    channelPromise = connectRabbit().catch((error) => {
      channelPromise = null;
      throw error;
    });
  }

  return channelPromise;
}

export async function closeRabbitConnection() {
  await channel?.close().catch(() => {});
  await connection?.close().catch(() => {});
  channel = null;
  connection = null;
  channelPromise = null;
}

async function connectRabbit() {
  connection = await amqp.connect(env.amqpUrl);
  connection.on('error', (error) => {
    logger.error('rabbitmq_connection_error', { errorMessage: error.message });
  });
  connection.on('close', () => {
    channel = null;
    connection = null;
    channelPromise = null;
  });

  channel = await connection.createChannel();
  await channel.assertExchange(env.rabbitmq.ticketEventsExchange, 'topic', {
    durable: true
  });

  return channel;
}
