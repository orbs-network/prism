/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { BlockTransaction } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import * as winston from 'winston';
import { ITx } from '../../shared/ITx';
import { MONGODB_URI } from '../config';
import { IDB } from '../db/IDB';
import { InMemoryDB } from '../db/InMemoryDB';
import { MongoDB } from '../db/MongoDB';
import { genLogger } from '../logger/LoggerFactory';
import {
  generateBlockTransaction,
  generateContractDeployTransaction,
  generateRandomRawBlock,
  generateRawBlockWithTransaction,
} from '../orbs-adapter/fake-blocks-generator';
import { rawBlockToBlock, rawTxToTx } from '../transformers/blockTransform';

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

      const txes = rawBlock.transactions.map((tx, idx) => rawTxToTx(tx, idx));
      await db.storeTxes(txes);

      for (const tx of txes) {
        const actual = await db.getTxById(tx.txId);
        expect(tx).toEqual(actual);
      }
    });

    it('should ignore case when retrive txs', async () => {
      const rawBlock = generateRandomRawBlock(1n);

      const txes = rawBlock.transactions.map((tx, idx) => rawTxToTx(tx, idx));
      // conver all to upper case
      rawBlock.transactions.forEach(tx => (tx.txId = tx.txId.toUpperCase()));

      await db.storeTxes(txes);

      for (const tx of txes) {
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
      const btx: BlockTransaction = generateContractDeployTransaction('test-contract', code);
      const rawBlock = generateRawBlockWithTransaction(1n, btx);

      const tx = rawTxToTx(rawBlock.transactions[0], 0);
      await db.storeTxes([tx]);

      const actual = await db.getDeployContractTx('test-contract', 1);
      expect(tx).toEqual(actual);
    });

    it('should store and retrive contract execution counter', async () => {
      await db.storeContractExecutionCounter('contract_1', 1);
      await db.storeContractExecutionCounter('contract_1', 2);
      await db.storeContractExecutionCounter('contract_2', 1);
      await db.storeContractExecutionCounter('contract_1', 3);
      const actual = await db.getContractsExecutionCounter();
      expect(actual.get('contract_1')).toEqual(3);
      expect(actual.get('contract_2')).toEqual(1);
    });

    describe('Retriving txes by contract name', async () => {
      const contractName = 'test-contract';

      let block1DeployTx: ITx;
      let block2Tx1: ITx;
      let block2Tx2: ITx;
      let block3Tx3: ITx;
      let block3Tx4: ITx;
      let block3Tx5: ITx;
      let block3Tx6: ITx;
      let block4Tx7: ITx;
      let block4Tx8: ITx;

      beforeEach(async () => {
        //
        // ------------       ------------      ----------------------      ------------
        // | h=1n     |       | h=2n     |      | h=3n               |      | h=4n     |
        // |          |  -->  |          | -->  |                    | -->  |          |
        // | deployTx |       | tx1, tx2 |      | tx3, tx4, tx5, tx6 |      | tx7, tx8 |
        // ------------       ------------      ----------------------      ------------
        //
        // Note: tx1 and tx5 are not the same contract as the other txes.

        const code: string = 'this is go code';
        const deployTx: BlockTransaction = generateContractDeployTransaction(contractName, code);
        const tx1 = generateBlockTransaction('other-contract', 'some-other-method');
        const tx2 = generateBlockTransaction('test-contract', 'some-method1');
        const tx3 = generateBlockTransaction('test-contract', 'some-method2');
        const tx4 = generateBlockTransaction('test-contract', 'some-method3');
        const tx5 = generateBlockTransaction('other-contract', 'some-other-method');
        const tx6 = generateBlockTransaction('test-contract', 'some-method4');
        const tx7 = generateBlockTransaction('test-contract', 'some-method5');
        const tx8 = generateBlockTransaction('test-contract', 'some-method6');
        const deployRawBlock = generateRawBlockWithTransaction(1n, deployTx);
        const rawBlock2 = generateRawBlockWithTransaction(2n, [tx1, tx2]);
        const rawBlock3 = generateRawBlockWithTransaction(3n, [tx3, tx4, tx5, tx6]);
        const rawBlock4 = generateRawBlockWithTransaction(4n, [tx7, tx8]);

        await db.storeBlock(rawBlockToBlock(deployRawBlock));
        await db.storeBlock(rawBlockToBlock(rawBlock2));
        await db.storeBlock(rawBlockToBlock(rawBlock3));
        await db.storeBlock(rawBlockToBlock(rawBlock4));

        block1DeployTx = rawTxToTx(deployRawBlock.transactions[0], 0);

        block2Tx1 = rawTxToTx(rawBlock2.transactions[0], 0);
        block2Tx2 = rawTxToTx(rawBlock2.transactions[1], 0);

        block3Tx3 = rawTxToTx(rawBlock3.transactions[0], 1);
        block3Tx4 = rawTxToTx(rawBlock3.transactions[1], 2);
        block3Tx5 = rawTxToTx(rawBlock3.transactions[2], 1);
        block3Tx6 = rawTxToTx(rawBlock3.transactions[3], 3);

        block4Tx7 = rawTxToTx(rawBlock4.transactions[0], 4);
        block4Tx8 = rawTxToTx(rawBlock4.transactions[1], 5);

        await db.storeTxes([block1DeployTx]);
        await db.storeTxes([block2Tx1, block2Tx2]);
        await db.storeTxes([block3Tx3, block3Tx4, block3Tx5, block3Tx6]);
        await db.storeTxes([block4Tx7, block4Tx8]);
      });

      it('Simple contract details extraction', async () => {
        const actual = await db.getContractTxes(contractName, 100);
        expect([block4Tx8, block4Tx7, block3Tx6, block3Tx4, block3Tx3, block2Tx2]).toEqual(actual);
      });

      it('should return only the requested number of txes', async () => {
        const actual = await db.getContractTxes(contractName, 3);
        expect([block4Tx8, block4Tx7, block3Tx6]).toEqual(actual);
      });

      it('starting from the given block height', async () => {
        const actual = await db.getContractTxes(contractName, 100, { blockHeight: 3n });
        expect([block3Tx6, block3Tx4, block3Tx3, block2Tx2]).toEqual(actual);
      });

      it('starting from the given block height and contractExecutionIdx', async () => {
        const actual = await db.getContractTxes(contractName, 100, { blockHeight: 3n, contractExecutionIdx: 2 });
        expect([block3Tx4, block3Tx3, block2Tx2]).toEqual(actual);
      });

      it('should accept unrelated contractExecutionIdx', async () => {
        const actual = await db.getContractTxes(contractName, 100, { blockHeight: 3n, contractExecutionIdx: 666 });
        expect([block3Tx6, block3Tx4, block3Tx3, block2Tx2]).toEqual(actual);
      });
    });
  });
}
