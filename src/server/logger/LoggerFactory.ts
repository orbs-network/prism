import * as winston from 'winston';

export function genLogger(toConsole: boolean, toFile: boolean, toRemote: boolean): winston.Logger {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
  });

  if (toConsole) {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
  }

  if (toFile) {
    logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
    logger.add(new winston.transports.File({ filename: 'combined.log' }));
  }

  return logger;
}
