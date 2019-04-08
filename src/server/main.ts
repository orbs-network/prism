/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import {
  GAP_FILLER_ACTIVE,
  GAP_FILLER_INTERVAL,
  GAP_FILLER_INITIAL_DELAY,
  ROLLBAR_ACCESS_TOKEN_SERVER,
  IS_PRODUCTION,
} from './config';
import { genDb } from './db/DBFactory';
import { fillGapsForever } from './gaps-filler/GapsFiller';
import { genOrbsAdapter } from './orbs-adapter/OrbsAdapterFactory';
import { initServer } from './server';
import { Storage } from './storage/storage';
import { WS } from './ws/ws';
import { sleep } from './gaps-filler/Cron';
import * as config from './config';
import Rollbar = require('rollbar');

if (IS_PRODUCTION && ROLLBAR_ACCESS_TOKEN_SERVER) {
  const rollbar = new Rollbar({
    accessToken: ROLLBAR_ACCESS_TOKEN_SERVER,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });

  rollbar.log('Hello world!');
}

async function main() {
  console.log(`  *******************************************  `);
  console.log(`IS_PRODUCTION: ${config.IS_PRODUCTION}`);
  console.log(`IS_STAGING: ${config.IS_STAGING}`);
  console.log(`IS_DEV: ${config.IS_DEV}`);
  console.log(`SERVER_PORT: ${config.SERVER_PORT}`);
  console.log(`WEBPACK_PORT: ${config.WEBPACK_PORT}`);
  console.log(`POSTGRES_URL: ${config.POSTGRES_URL}`);
  console.log(`MONGODB_URI: ${config.MONGODB_URI}`);
  console.log(`DATABASE_TYPE: ${config.DATABASE_TYPE}`);
  console.log(`ORBS_ENDPOINT: ${config.ORBS_ENDPOINT}`);
  console.log(`ORBS_VIRTUAL_CHAIN_ID: ${config.ORBS_VIRTUAL_CHAIN_ID}`);
  console.log(`ORBS_NETWORK_TYPE: ${config.ORBS_NETWORK_TYPE}`);
  console.log(`POOLING_INTERVAL: ${config.POOLING_INTERVAL}`);
  console.log(`DB_IS_READ_ONLY: ${config.DB_IS_READ_ONLY}`);
  console.log(`GAP_FILLER_ACTIVE: ${config.GAP_FILLER_ACTIVE}`);
  console.log(`GAP_FILLER_INTERVAL: ${config.GAP_FILLER_INTERVAL}`);
  console.log(`GAP_FILLER_INITIAL_DELAY: ${config.GAP_FILLER_INITIAL_DELAY}`);
  console.log(`  *******************************************  `);

  // externals
  const orbsAdapter = genOrbsAdapter();
  const db = genDb();
  await db.init(); // create tables if needed

  // internals
  const storage = new Storage(db);
  const server = initServer(storage);
  const ws = new WS(server);

  // link all the parts
  orbsAdapter.RegisterToNewBlocks(ws);
  orbsAdapter.RegisterToNewBlocks(storage);
  await orbsAdapter.init();

  if (GAP_FILLER_ACTIVE) {
    await sleep(GAP_FILLER_INITIAL_DELAY);
    fillGapsForever(storage, orbsAdapter, GAP_FILLER_INTERVAL);
  }
}

main()
  .then(() => console.log('running'))
  .catch(err => console.log(`error: ${err}`));
