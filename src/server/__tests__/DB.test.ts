/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { BlockTransaction } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import * as winston from 'winston';
import { IShortTx } from '../../shared/IContractData';
import { ITx } from '../../shared/ITx';
import { MONGODB_URI } from '../config';
import { IDB } from '../db/IDB';
import { InMemoryDB } from '../db/InMemoryDB';
import { MongoDB } from '../db/MongoDB';
import { genLogger } from '../logger/LoggerFactory';
import {
  generateBlockResponseWithTransaction,
  generateBlockTransaction,
  generateContractDeployTransaction,
  generateRandomGetBlockRespose,
} from '../orbs-adapter/fake-blocks-generator';
import {
  blockResponseToBlock,
  blockResponseTransactionAsTx,
  blockResponseTransactionsToTxs,
} from '../transformers/blockTransform';
import { txToShortTx } from '../transformers/txTransform';

const logger: winston.Logger = genLogger(false, false, false);

testDb(new InMemoryDB(), 'InMemoryDB');
testDb(new MongoDB(logger, MONGODB_URI), 'MongoDB');

function testDb(db: IDB, dbName: string) {
  describe(dbName, () => {
    beforeEach(async () => {
      await db.init();
      await db.clearAll();
    });

    afterEach(async () => {
      await db.clearAll();
      await db.destroy();
    });

    it('should store and retrive blocks by hash', async () => {
      const block = blockResponseToBlock(generateRandomGetBlockRespose(1n));

      await db.storeBlock(block);

      const actual = await db.getBlockByHash(block.blockHash);
      expect(block).toEqual(actual);
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
      const block = blockResponseToBlock(generateRandomGetBlockRespose(1n));

      await db.storeBlock(block);

      const actual = await db.getBlockByHeight(block.blockHeight);
      expect(block).toEqual(actual);
    });

    it('should be able to retrive the latest blocks', async () => {
      const block1 = blockResponseToBlock(generateRandomGetBlockRespose(1n));
      const block2 = blockResponseToBlock(generateRandomGetBlockRespose(2n));
      const block3 = blockResponseToBlock(generateRandomGetBlockRespose(3n));
      const block4 = blockResponseToBlock(generateRandomGetBlockRespose(4n));
      const block5 = blockResponseToBlock(generateRandomGetBlockRespose(5n));
      await db.storeBlock(block1);
      await db.storeBlock(block2);
      await db.storeBlock(block3);
      await db.storeBlock(block4);
      await db.storeBlock(block5);

      const actual = await db.getLatestBlocks(3);
      expect(actual).toEqual([block5, block4, block3]);
    });

    it('should store and retrive txs', async () => {
      const block = generateRandomGetBlockRespose(1n);
      const txes = blockResponseTransactionsToTxs(block);

      await db.storeTxes(txes);

      for (const tx of txes) {
        const actual = await db.getTxById(tx.txId);
        expect(tx).toEqual(actual);
      }
    });

    it('should ignore case when retrive txs', async () => {
      const block = generateRandomGetBlockRespose(1n);
      const txes = blockResponseTransactionsToTxs(block);

      // conver all to upper case
      txes.forEach(tx => (tx.txId = tx.txId.toUpperCase()));

      await db.storeTxes(txes);

      for (const tx of txes) {
        const actual = await db.getTxById(tx.txId.toLowerCase());
        expect(tx).toEqual(actual);
      }
    });

    it('should be able to retrive the last block height', async () => {
      const block10 = blockResponseToBlock(generateRandomGetBlockRespose(10n));
      const block11 = blockResponseToBlock(generateRandomGetBlockRespose(11n));
      const block12 = blockResponseToBlock(generateRandomGetBlockRespose(12n));

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

    it('should have a db version 0.0.0 as the default', async () => {
      const actual = await db.getVersion();
      expect(actual).toEqual('0.0.0');
    });

    it('should store and retrive the db version ', async () => {
      const initial = await db.getVersion();

      await db.setVersion('0.0.4');
      const actual = await db.getVersion();
      expect(actual).toEqual('0.0.4');
      expect(actual).not.toEqual(initial);
    });

    it('should be able to update existing db version ', async () => {
      const initial = await db.getVersion();

      await db.setVersion('0.1.2');
      await db.setVersion('1.0.0');
      const actual = await db.getVersion();
      expect(actual).toEqual('1.0.0');
      expect(actual).not.toEqual(initial);
    });

    it('should retrive contract by name', async () => {
      const code: string = 'this is go code';
      const btx: BlockTransaction = generateContractDeployTransaction('test-contract', code);
      const block = generateBlockResponseWithTransaction(1n, btx);

      const tx = blockResponseTransactionAsTx(block, 0);
      await db.storeTxes([tx]);

      const actual = await db.getDeployContractTx('test-contract');
      expect(tx).toEqual(actual);
    });

    it('should retrive multi-file contract by name', async () => {
      const code1: string = 'this is go code 1';
      const code2: string = 'this is go code 2';
      const btx: BlockTransaction = generateContractDeployTransaction('test-contract', code1, code2);
      const block = generateBlockResponseWithTransaction(1n, btx);

      const tx = blockResponseTransactionAsTx(block, 0);
      await db.storeTxes([tx]);

      const actual = await db.getDeployContractTx('test-contract');
      expect(tx).toEqual(actual);
    });

    describe('Retriving txes by contract name', () => {
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

      let shortTx5: IShortTx;
      let shortTx4: IShortTx;
      let shortTx3: IShortTx;
      let shortTx2: IShortTx;
      let shortTx1: IShortTx;
      let shortTx0: IShortTx;

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
        const deployBlock = generateBlockResponseWithTransaction(1n, deployTx);
        const block2 = generateBlockResponseWithTransaction(2n, [tx1, tx2]);
        const block3 = generateBlockResponseWithTransaction(3n, [tx3, tx4, tx5, tx6]);
        const block4 = generateBlockResponseWithTransaction(4n, [tx7, tx8]);

        await db.storeBlock(blockResponseToBlock(deployBlock));
        await db.storeBlock(blockResponseToBlock(block2));
        await db.storeBlock(blockResponseToBlock(block3));
        await db.storeBlock(blockResponseToBlock(block4));

        block1DeployTx = blockResponseTransactionAsTx(deployBlock, 0);

        block2Tx1 = blockResponseTransactionAsTx(block2, 0);
        block2Tx2 = blockResponseTransactionAsTx(block2, 1); // execution order: 1

        block3Tx3 = blockResponseTransactionAsTx(block3, 0); // execution order: 2
        block3Tx4 = blockResponseTransactionAsTx(block3, 1); // execution order: 3
        block3Tx5 = blockResponseTransactionAsTx(block3, 2);
        block3Tx6 = blockResponseTransactionAsTx(block3, 3); // execution order: 4

        block4Tx7 = blockResponseTransactionAsTx(block4, 0); // execution order: 5
        block4Tx8 = blockResponseTransactionAsTx(block4, 1); // execution order: 6

        await db.storeTxes([block1DeployTx]);
        await db.storeTxes([block2Tx1, block2Tx2]);
        await db.storeTxes([block3Tx3, block3Tx4, block3Tx5, block3Tx6]);
        await db.storeTxes([block4Tx7, block4Tx8]);

        shortTx5 = txToShortTx(block4Tx8, 6);
        shortTx4 = txToShortTx(block4Tx7, 5);
        shortTx3 = txToShortTx(block3Tx6, 4);
        shortTx2 = txToShortTx(block3Tx4, 3);
        shortTx1 = txToShortTx(block3Tx3, 2);
        shortTx0 = txToShortTx(block2Tx2, 1);
      });

      it('Simple contract details extraction', async () => {
        const actual = await db.getContractTxes(contractName, 100);
        const txes: IShortTx[] = [shortTx5, shortTx4, shortTx3, shortTx2, shortTx1, shortTx0];
        expect(txes).toEqual(actual);
      });

      it('should return only the requested number of txes', async () => {
        const actual = await db.getContractTxes(contractName, 3);
        const txes: IShortTx[] = [shortTx5, shortTx4, shortTx3];
        expect(txes).toEqual(actual);
      });

      it('should return only the txes below the given executionIdx', async () => {
        const actual = await db.getContractTxes(contractName, 2, 4);
        const txes: IShortTx[] = [shortTx4, shortTx3];
        expect(txes).toEqual(actual);
      });

      it('should ignore a too large executionIdx', async () => {
        const actual = await db.getContractTxes(contractName, 2, 400);
        const txes: IShortTx[] = [shortTx5, shortTx4];
        expect(txes).toEqual(actual);
      });

      it('should ignore a too small executionIdx', async () => {
        const actual = await db.getContractTxes(contractName, 2, -400);
        const txes: IShortTx[] = [shortTx0];
        expect(txes).toEqual(actual);
      });
    });
  });
}
