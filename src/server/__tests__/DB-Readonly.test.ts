/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { encodeHex } from 'orbs-client-sdk';
import * as winston from 'winston';
import { MONGODB_URI } from '../config';
import { IDB } from '../db/IDB';
import { InMemoryDB } from '../db/InMemoryDB';
import { MongoDB } from '../db/MongoDB';
import { genLogger } from '../logger/LoggerFactory';
import { generateRandomGetBlockRespose } from '../orbs-adapter/fake-blocks-generator';
import { blockResponseToBlock, blockResponseTransactionsToTxs } from '../transformers/blockTransform';

const logger: winston.Logger = genLogger(false, false, false);

testReadOnlyDb(new InMemoryDB(true), 'InMemoryDB');
testReadOnlyDb(new MongoDB(logger, MONGODB_URI, true), 'MongoDB');

function testReadOnlyDb(db: IDB, dbName: string) {
  describe(`${dbName} - Readonly`, () => {
    beforeEach(async () => {
      await db.init();
      await db.clearAll();
    });

    afterEach(async () => {
      await db.clearAll();
      await db.destroy();
    });

    it('should NOT store blocks by hash', async () => {
      const block = generateRandomGetBlockRespose(1n);

      await db.storeBlock(blockResponseToBlock(block));
      const blockHash = encodeHex(block.resultsBlockHash);

      const actual = await db.getBlockByHash(blockHash);
      expect(actual).toBeNull();
    });

    it('should NOT store txs', async () => {
      const block = generateRandomGetBlockRespose(1n);

      await db.storeBlock(blockResponseToBlock(block));
      const txes = blockResponseTransactionsToTxs(block);

      for (const tx of txes) {
        const actual = await db.getTxById(tx.txId);
        expect(actual).toBeNull();
      }
    });

    it('should NOT store the heighest consecutive block height', async () => {
      await db.setHeighestConsecutiveBlockHeight(123n);
      const actual = await db.getHeighestConsecutiveBlockHeight();
      expect(actual).toEqual(0n);
    });

    it('should NOT store the heighest consecutive block height', async () => {
      await db.setVersion('1.2.3');
      const actual = await db.getVersion();
      expect(actual).toEqual('0.0.0');
    });

    it('should NOT store the DB filling method', async () => {
      await db.setDBFillingMethod('DBBuilder');
      const actual = await db.getDBFillingMethod();
      expect(actual).toEqual('None');
    });

    it('should NOT store the DB building status', async () => {
      await db.setDBBuildingStatus('InWork');
      const actual = await db.getDBBuildingStatus();
      expect(actual).toEqual('None');
    });
  });
}
