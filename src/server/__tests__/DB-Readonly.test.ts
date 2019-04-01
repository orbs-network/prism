/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { rawBlockToBlock } from '../block-transform/blockTransform';
import { generateRandomRawBlock } from '../orbs-adapter/fake-blocks-generator';
import { InMemoryDB } from '../db/InMemoryDB';
import { IDB } from '../db/IDB';
import { MongoDB } from '../db/MongoDB';
import { MONGODB_URI } from '../config';

testReadOnlyDb(new InMemoryDB(true), 'InMemoryDB');
testReadOnlyDb(new MongoDB(MONGODB_URI, true), 'MongoDB');

function testReadOnlyDb(db: IDB, dbName: string) {
  describe(`${dbName} - Readonly`, async () => {
    beforeEach(async () => {
      await db.init();
      await db.clearAll();
    });

    afterEach(async () => {
      await db.destroy();
    });

    it('should NOT store blocks by hash', async () => {
      const rawBlock = generateRandomRawBlock(1n);

      await db.storeBlock(rawBlockToBlock(rawBlock));

      const actual = await db.getBlockByHash(rawBlock.blockHash);
      expect(actual).toBeNull();
    });

    it('should NOT store txs', async () => {
      const rawBlock = generateRandomRawBlock(1n);

      await db.storeTx(rawBlock.transactions);

      for (const tx of rawBlock.transactions) {
        const actual = await db.getTxById(tx.txId);
        expect(actual).toBeNull();
      }
    });

    it('should NOT store the heighest consecutive block height ', async () => {
      const initial = await db.getHeighestConsecutiveBlockHeight();

      await db.setHeighestConsecutiveBlockHeight(123n);
      const actual = await db.getHeighestConsecutiveBlockHeight();
      expect(actual).toEqual(initial);
    });
  });
}
