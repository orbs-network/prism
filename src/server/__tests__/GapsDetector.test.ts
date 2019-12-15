/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IDB } from '../db/IDB';
import { InMemoryDB } from '../db/InMemoryDB';
import { detectBlockChainGaps } from '../gaps-filler/GapsDetector';
import { genLogger } from '../logger/LoggerFactory';
import { generateRandomGetBlockResponse } from '../orbs-adapter/fake-blocks-generator';
import { Storage } from '../storage/storage';

describe('Gaps Detector', () => {
  it('should detect gaps in the storage', async () => {
    const logger = genLogger(false, false, false);
    const db: IDB = new InMemoryDB();
    await db.init();
    const storage: Storage = new Storage(db);
    await storage.handleNewBlock(generateRandomGetBlockResponse(1n));
    await storage.handleNewBlock(generateRandomGetBlockResponse(2n));
    await storage.handleNewBlock(generateRandomGetBlockResponse(3n));
    await storage.handleNewBlock(generateRandomGetBlockResponse(6n));
    await storage.handleNewBlock(generateRandomGetBlockResponse(7n));
    await storage.handleNewBlock(generateRandomGetBlockResponse(8n));
    await storage.handleNewBlock(generateRandomGetBlockResponse(10n));

    const latestHeight = await storage.getLatestBlockHeight();
    const actual = await detectBlockChainGaps(storage, 1n, latestHeight);
    expect(actual).toEqual([4n, 5n, 9n]);
  });

  it('should detect gaps in the storage, starting from specific height', async () => {
    const logger = genLogger(false, false, false);
    const db: IDB = new InMemoryDB();
    await db.init();
    const storage: Storage = new Storage(db);
    await storage.handleNewBlock(generateRandomGetBlockResponse(6n));
    await storage.handleNewBlock(generateRandomGetBlockResponse(7n));
    await storage.handleNewBlock(generateRandomGetBlockResponse(10n));
    await storage.handleNewBlock(generateRandomGetBlockResponse(20n));

    const actual = await detectBlockChainGaps(storage, 4n, 15n);
    expect(actual).toEqual([4n, 5n, 8n, 9n, 11n, 12n, 13n, 14n, 15n]);
  });
});
