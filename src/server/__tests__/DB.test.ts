/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { rawBlockToBlock } from '../block-transform/blockTransform';
import { MONGODB_URI } from '../config';
import { IDB } from '../db/IDB';
import { InMemoryDB } from '../db/InMemoryDB';
import { MongoDB } from '../db/MongoDB';
import {
  generateRandomRawBlock,
  generateRawBlockWithTransaction,
  generateContractDeployTransaction,
  generateBlockTransaction,
} from '../orbs-adapter/fake-blocks-generator';
import * as winston from 'winston';
import { genLogger } from '../logger/LoggerFactory';
import { BlockTransaction } from 'orbs-client-sdk/dist/codec/OpGetBlock';

const logger: winston.Logger = genLogger(false, false, false);

testDb(new InMemoryDB(), 'InMemoryDB');
testDb(new MongoDB(logger, MONGODB_URI), 'MongoDB');

function testDb(db: IDB, dbName: string) {
  describe(dbName, async () => {
    beforeEach(async () => {
      await db.init();
      await db.clearAll();
    });

    afterEach(async () => {
      await db.clearAll();
      await db.destroy();
    });

    it('should store and retrive blocks by hash', async () => {
      const rawBlock = generateRandomRawBlock(1n);

      await db.storeBlock(rawBlockToBlock(rawBlock));

      const actual = await db.getBlockByHash(rawBlock.blockHash);
      expect(rawBlockToBlock(rawBlock)).toEqual(actual);
    });

    it('should return null if no block found when searching a block by hash', async () => {
      const actual = await db.getBlockByHash('fake data');
      expect(actual).toBeNull();
    });

    it('should return null if no block found when searching a block by height', async () => {
      const actual = await db.getBlockByHeight('10');
      expect(actual).toBeNull();
    });

    it('should be able to retrive blocks by height', async () => {
      const block = rawBlockToBlock(generateRandomRawBlock(1n));

      await db.storeBlock(block);

      const actual = await db.getBlockByHeight(block.blockHeight);
      expect(block).toEqual(actual);
    });

    it('should be able to retrive the latest blocks', async () => {
      const block1 = rawBlockToBlock(generateRandomRawBlock(1n));
      const block2 = rawBlockToBlock(generateRandomRawBlock(2n));
      const block3 = rawBlockToBlock(generateRandomRawBlock(3n));
      const block4 = rawBlockToBlock(generateRandomRawBlock(4n));
      const block5 = rawBlockToBlock(generateRandomRawBlock(5n));
      await db.storeBlock(block1);
      await db.storeBlock(block2);
      await db.storeBlock(block3);
      await db.storeBlock(block4);
      await db.storeBlock(block5);

      const actual = await db.getLatestBlocks(3);
      expect(actual).toEqual([block5, block4, block3]);
    });

    it('should store and retrive txs', async () => {
      const rawBlock = generateRandomRawBlock(1n);

      await db.storeTxes(rawBlock.transactions);

      for (const tx of rawBlock.transactions) {
        const actual = await db.getTxById(tx.txId);
        expect(tx).toEqual(actual);
      }
    });

    it('should ignore case when retrive txs', async () => {
      const rawBlock = generateRandomRawBlock(1n);

      // conver all to upper case
      rawBlock.transactions.forEach(tx => (tx.txId = tx.txId.toUpperCase()));

      await db.storeTxes(rawBlock.transactions);

      for (const tx of rawBlock.transactions) {
        const actual = await db.getTxById(tx.txId.toLowerCase());
        expect(tx).toEqual(actual);
      }
    });

    it('should be able to retrive the last block height', async () => {
      const block10 = rawBlockToBlock(generateRandomRawBlock(10n));
      const block11 = rawBlockToBlock(generateRandomRawBlock(11n));
      const block12 = rawBlockToBlock(generateRandomRawBlock(12n));

      await db.storeBlock(block10);
      await db.storeBlock(block11);
      await db.storeBlock(block12);

      const actual = await db.getLatestBlockHeight();
      expect(actual).toEqual(12n);
    });

    it('should return 0n if there are no blocks', async () => {
      const actual = await db.getLatestBlockHeight();
      expect(actual).toEqual(0n);
    });

    it('should store and retrive the heighest consecutive block height ', async () => {
      const initial = await db.getHeighestConsecutiveBlockHeight();

      await db.setHeighestConsecutiveBlockHeight(initial + 123n);
      const actual = await db.getHeighestConsecutiveBlockHeight();
      expect(actual).toEqual(initial + 123n);
      expect(actual).not.toEqual(initial);
    });

    it('should be able to update existing heighest consecutive block height ', async () => {
      const initial = await db.getHeighestConsecutiveBlockHeight();

      await db.setHeighestConsecutiveBlockHeight(123n);
      await db.setHeighestConsecutiveBlockHeight(456n);
      const actual = await db.getHeighestConsecutiveBlockHeight();
      expect(actual).toEqual(456n);
      expect(actual).not.toEqual(initial);
    });

    it('should retrive contract by name', async () => {
      const code: string = 'this is go code';
      const tx: BlockTransaction = generateContractDeployTransaction('test-contract', code);
      const rawBlock = generateRawBlockWithTransaction(1n, tx);

      await db.storeTxes(rawBlock.transactions);

      const actual = await db.getDeployContractTx('test-contract', 1);
      expect(rawBlock.transactions[0]).toEqual(actual);
    });

    it('should retrive txes by contract name', async () => {
      const code: string = 'this is go code';
      const contractName = 'test-contract';
      const deployTx: BlockTransaction = generateContractDeployTransaction(contractName, code);
      const tx1 = generateBlockTransaction('test-contract', 'some-method1');
      const tx2 = generateBlockTransaction('test-contract', 'some-method2');
      const tx3 = generateBlockTransaction('test-contract', 'some-method3');
      const deployRawBlock = generateRawBlockWithTransaction(1n, deployTx);
      const rawBlock1 = generateRawBlockWithTransaction(2n, tx1);
      const rawBlock2 = generateRawBlockWithTransaction(3n, tx2);
      const rawBlock3 = generateRawBlockWithTransaction(4n, tx3);

      await db.storeBlock(rawBlockToBlock(deployRawBlock));
      await db.storeBlock(rawBlockToBlock(rawBlock1));
      await db.storeBlock(rawBlockToBlock(rawBlock2));
      await db.storeBlock(rawBlockToBlock(rawBlock3));
      await db.storeTxes(deployRawBlock.transactions);
      await db.storeTxes(rawBlock1.transactions);
      await db.storeTxes(rawBlock2.transactions);
      await db.storeTxes(rawBlock3.transactions);

      const rawTx1 = rawBlock1.transactions[0];
      const rawTx2 = rawBlock2.transactions[0];
      const rawTx3 = rawBlock3.transactions[0];

      const actual = await db.getContractTxes(contractName, 100);
      expect([rawTx3, rawTx2, rawTx1]).toEqual(actual);
    });

    it('should retrive txes by contract name with limited number of txes', async () => {
      const code: string = 'this is go code';
      const contractName = 'test-contract';
      const deployTx: BlockTransaction = generateContractDeployTransaction(contractName, code);
      const tx1 = generateBlockTransaction('other-contract', 'some-other-method');
      const tx2 = generateBlockTransaction('test-contract', 'some-method1');
      const tx3 = generateBlockTransaction('test-contract', 'some-method2');
      const tx4 = generateBlockTransaction('test-contract', 'some-method3');
      const tx5 = generateBlockTransaction('test-contract', 'some-method4');
      const deployRawBlock = generateRawBlockWithTransaction(1n, deployTx);
      const rawBlock1 = generateRawBlockWithTransaction(2n, [tx1, tx2]);
      const rawBlock2 = generateRawBlockWithTransaction(3n, [tx3]);
      const rawBlock3 = generateRawBlockWithTransaction(4n, [tx4, tx5]);

      await db.storeBlock(rawBlockToBlock(deployRawBlock));
      await db.storeBlock(rawBlockToBlock(rawBlock1));
      await db.storeBlock(rawBlockToBlock(rawBlock2));
      await db.storeBlock(rawBlockToBlock(rawBlock3));
      await db.storeTxes(deployRawBlock.transactions);
      await db.storeTxes(rawBlock1.transactions);
      await db.storeTxes(rawBlock2.transactions);
      await db.storeTxes(rawBlock3.transactions);

      const rawTx5 = rawBlock3.transactions[1];
      const rawTx4 = rawBlock3.transactions[0];
      const rawTx3 = rawBlock2.transactions[0];
      const actual = await db.getContractTxes(contractName, 3);
      expect([rawTx5, rawTx4, rawTx3]).toEqual(actual);
    });
  });
}
