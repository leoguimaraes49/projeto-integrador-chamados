function write(level, event, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...details
  };
  const output = JSON.stringify(entry);

  if (level === 'error') {
    console.error(output);
    return;
  }

  console.log(output);
}

export const logger = {
  info(event, details) {
    write('info', event, details);
  },
  warn(event, details) {
    write('warn', event, details);
  },
  error(event, details) {
    write('error', event, details);
  }
};
