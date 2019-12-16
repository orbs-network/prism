/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { InMemoryDB } from '../db/InMemoryDB';
import { fillGaps } from '../gaps-filler/GapsFiller';
import { MockOrbsClient } from '../orbs-client/MockOrbsClient';
import { Storage } from '../storage/storage';
import { waitUntil } from './TimeUtils';
import { genLogger } from '../logger/LoggerFactory';
import * as winston from 'winston';
import { IOrbsBlocksPolling, OrbsBlocksPolling } from 'orbs-blocks-polling-js';

describe('Gaps Filler', () => {
  const logger: winston.Logger = genLogger(false, false, false);
  let db: InMemoryDB;
  let orbsBlocksPolling: IOrbsBlocksPolling;
  let orbsClientMock: MockOrbsClient;
  let storage: Storage;

  beforeEach(async () => {
    db = new InMemoryDB();
    await db.init();

    orbsClientMock = new MockOrbsClient();
    orbsBlocksPolling = new OrbsBlocksPolling(orbsClientMock as any, logger);
    storage = new Storage(db);
    orbsBlocksPolling.RegisterToNewBlocks(storage);
  });

  afterEach(() => {
    orbsBlocksPolling.dispose();
  });

  it('should fill all the missing blocks', async () => {
    // append 10 blocks to orbs block chain (No one is listening)
    orbsClientMock.generateBlocks(10);

    // start orbs adapter scheduler (Will start from height 10 + 1)
    await orbsBlocksPolling.initPolling(25);

    // append 5 blocks to orbs block chain
    orbsClientMock.generateBlocks(5);

    // let the scheduler catch up with the 5 new blocks
    await waitUntil(async () => (await storage.getLatestBlockHeight()) === 15n);

    // make sure that the storage holds the 5 new blocks [11..15]
    for (let i = 11; i <= 15; i++) {
      const block = await storage.getBlockByHeight(i.toString());
      expect(block).not.toBeNull();
    }

    // fill the gap from 1 to 10
    await fillGaps(logger, storage, orbsBlocksPolling);

    // make sure that the storage holds the all 15 blocks
    for (let i = 1; i <= 15; i++) {
      const block = await storage.getBlockByHeight(i.toString());
      expect(block).not.toBeNull();
    }
  });

  it('should update the highest consecutive block height after filling the gap', async () => {
    // append 10 blocks to orbs block chain (No one is listening)
    orbsClientMock.generateBlocks(10);

    // start orbs adapter scheduler (Will start from height 10 + 1)
    await orbsBlocksPolling.initPolling(25);

    // append 5 blocks to orbs block chain
    orbsClientMock.generateBlocks(5);

    // let the scheduler catch up with the 5 new blocks
    await waitUntil(async () => (await storage.getLatestBlockHeight()) === 15n);

    // fill the gap from 1 to 10
    await fillGaps(logger, storage, orbsBlocksPolling);

    // make sure that the storage holds the all 15 blocks
    const actual = await storage.getHighestConsecutiveBlockHeight();
    expect(actual).toBe(15n);
  });
});
