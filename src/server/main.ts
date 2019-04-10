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
  console.log(`config: ${JSON.stringify(config, null, 2)}`);
  console.log(`*******************************************`);

  const { GAP_FILLER_ACTIVE, GAP_FILLER_INTERVAL, GAP_FILLER_INITIAL_DELAY, IS_PRODUCTION } = config;
  const logger: winston.Logger = genLogger(true, IS_PRODUCTION, IS_PRODUCTION);

  // externals
  const orbsAdapter = genOrbsAdapter(logger);
  const db = genDb(logger);
  await db.init(); // create tables if needed

  // internals
  const storage = new Storage(db);
  const server = initServer(storage);
  const ws = new WS(logger, server);

  // link all the parts
  orbsAdapter.RegisterToNewBlocks(ws);
  orbsAdapter.RegisterToNewBlocks(storage);
  await orbsAdapter.init();

  if (GAP_FILLER_ACTIVE) {
    await sleep(GAP_FILLER_INITIAL_DELAY);
    fillGapsForever(logger, storage, orbsAdapter, GAP_FILLER_INTERVAL);
  }
}

main().then(() => console.log('running'));
