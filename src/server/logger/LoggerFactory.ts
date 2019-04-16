import * as winston from 'winston';
import { ROLLBAR_ACCESS_TOKEN_SERVER } from '../config';
import { Rollbar } from 'winston-transport-rollbar';
import * as path from 'path';

export function genLogger(toConsole: boolean, toFile: boolean, toRemote: boolean): winston.Logger {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
  });

  logger.add(new winston.transports.Console({ format: winston.format.simple(), silent: !toConsole }));

  if (toFile) {
    logger.add(
      new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'error.log'), level: 'error' }),
    );
    logger.add(new winston.transports.File({ filename: path.join(process.cwd(), 'logs', 'combined.log') }));
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
