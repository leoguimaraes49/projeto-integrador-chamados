import { afterEach, describe, expect, it, vi } from 'vitest';
import { logger } from '../src/utils/logger.js';

describe('logger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['info', 'log'],
    ['warn', 'log'],
    ['error', 'error']
  ])('registra o nivel %s como JSON', (level, consoleMethod) => {
    const outputSpy = vi.spyOn(console, consoleMethod).mockImplementation(() => {});

    logger[level]('test_event', { ticketId: 'ticket-1' });

    expect(outputSpy).toHaveBeenCalledOnce();
    expect(JSON.parse(outputSpy.mock.calls[0][0])).toMatchObject({
      level,
      event: 'test_event',
      ticketId: 'ticket-1'
    });
  });

  it('preserva os campos reservados do registro', () => {
    const outputSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    logger.info('expected_event', {
      timestamp: 'invalid',
      level: 'error',
      event: 'overridden_event'
    });

    const entry = JSON.parse(outputSpy.mock.calls[0][0]);
    expect(entry.timestamp).not.toBe('invalid');
    expect(entry.level).toBe('info');
    expect(entry.event).toBe('expected_event');
  });
});
