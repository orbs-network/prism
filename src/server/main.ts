/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { GAP_FILLER_ACTIVE, GAP_FILLER_INTERVAL, GAP_FILLER_INITIAL_DELAY } from './config';
import { genDb } from './db/DBFactory';
import { fillGapsForever } from './gaps-filler/GapsFiller';
import { genOrbsAdapter } from './orbs-adapter/OrbsAdapterFactory';
import { initServer } from './server';
import { Storage } from './storage/storage';
import { WS } from './ws/ws';
import { sleep } from './gaps-filler/Cron';

async function main() {
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
