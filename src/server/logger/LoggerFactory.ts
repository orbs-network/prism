import * as winston from 'winston';
import { ROLLBAR_ACCESS_TOKEN_SERVER } from '../config';
import { Rollbar } from 'winston-transport-rollbar';

export function genLogger(toConsole: boolean, toFile: boolean, toRemote: boolean): winston.Logger {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
  });

  logger.add(new winston.transports.Console({ format: winston.format.simple(), silent: !toConsole }));

  if (toFile) {
    logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
    logger.add(new winston.transports.File({ filename: 'combined.log' }));
  }

  if (toRemote && ROLLBAR_ACCESS_TOKEN_SERVER) {
    const rollbar = new Rollbar({
      rollbarConfig: {
        accessToken: ROLLBAR_ACCESS_TOKEN_SERVER,
        captureUncaught: true,
        captureUnhandledRejections: true,
      },
    });
    logger.add(rollbar);
  }

  return logger;
}
