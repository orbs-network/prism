/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { genDb } from './db/DBFactory';
import { fillGapsForever } from './gaps-filler/GapsFiller';
import { genOrbsAdapter } from './orbs-adapter/OrbsAdapterFactory';
import { initServer } from './server';
import { Storage } from './storage/storage';
import { WS } from './ws/ws';
import { sleep } from './gaps-filler/Cron';
import * as config from './config';
import * as winston from 'winston';
import { genLogger } from './logger/LoggerFactory';

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
  } = config;
  const logger: winston.Logger = genLogger(LOG_TO_CONSOLE, LOG_TO_FILE, LOG_TO_ROLLBAR);

  // externals
  const orbsAdapter = genOrbsAdapter(logger);
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
  orbsAdapter.RegisterToNewBlocks(ws);
  orbsAdapter.RegisterToNewBlocks(storage);
  await orbsAdapter.initPooling(POOLING_INTERVAL);

  if (GAP_FILLER_ACTIVE) {
    const GAP_FILLER_INITIAL_DELAY = 60 * 1000; // We wait a minute before we start the gap filler
    await sleep(GAP_FILLER_INITIAL_DELAY);
    fillGapsForever(logger, storage, db, orbsAdapter, GAP_FILLER_INTERVAL);
  }
}

main();
