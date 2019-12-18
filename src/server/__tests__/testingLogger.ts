import * as winston from 'winston';
import {genLogger} from '../logger/LoggerFactory';

export function getTestingLogger(): winston.Logger {
    const logger = genLogger(true, false, false);

    return logger;
}