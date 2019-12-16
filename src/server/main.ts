/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { genDb } from './db/DBFactory';
import { fillGapsForever } from './gaps-filler/GapsFiller';
import { genOrbsBlocksPolling } from './orbs-adapter/OrbsBlocksPollingFactory';
import { initServer } from './server';
import { Storage } from './storage/storage';
import { WS } from './ws/ws';
import config from './config';
import winston from 'winston';
import { genLogger } from './logger/LoggerFactory';
import { DBBuilder } from './db/DBBuilder';
import {increasePulledBlocksCounter} from './metrics/prometheusMetrics';

async function main() {
  console.log(`*******************************************`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`config: ${JSON.stringify(config, null, 2)}`);
  console.log(`*******************************************`);

  const {
    POOLING_INTERVAL,
    GAP_FILLER_ACTIVE,
    GAP_FILLER_INTERVAL,
    LOG_TO_CONSOLE,
    LOG_TO_FILE,
    LOG_TO_ROLLBAR,
    PRISM_VERSION,
    BLOCKS_POLLING_BATCH_SIZE,
    MAXIMUM_PARALLEL_PROMISES
  } = config;
  const logger: winston.Logger = genLogger(LOG_TO_CONSOLE, LOG_TO_FILE, LOG_TO_ROLLBAR);

  // externals
  const db = genDb(logger);
  try {
    await db.init();
    logger.info(`Database connected and initialized.`);
  } catch (error) {
    logger.error(`Unable to connect db`, { error });
    process.exit(1);
  }

  // internals
  const storage = new Storage(db);
  const server = initServer(storage);
  const ws = new WS(logger, server);

  // link all the parts
  const orbsBlocksPolling = genOrbsBlocksPolling(logger);
  await orbsBlocksPolling.init();

  const dbBuilder = new DBBuilder(db, storage, orbsBlocksPolling, logger, {
    blocksBatchSize: BLOCKS_POLLING_BATCH_SIZE,
    maxParallelPromises: MAXIMUM_PARALLEL_PROMISES,
  });

  dbBuilder.init(PRISM_VERSION)
      .then(() => {
        fillGapsForever(logger, storage, db, orbsBlocksPolling, GAP_FILLER_INTERVAL);
      })
      .catch(() => { // DEV_NOTE : Only critical error can be thrown from the 'DB Builder'
        process.exit(1);
      });

  orbsBlocksPolling.RegisterToNewBlocks({
    handleNewBlock: async () => increasePulledBlocksCounter()
  });
  orbsBlocksPolling.RegisterToNewBlocks(ws);
  orbsBlocksPolling.RegisterToNewBlocks(storage);
  await orbsBlocksPolling.initPolling(POOLING_INTERVAL);
}

main();
