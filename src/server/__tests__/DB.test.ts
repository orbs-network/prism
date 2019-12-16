/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { BlockTransaction } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import * as winston from 'winston';
import { IShortTx, IContractGist } from '../../shared/IContractData';
import { ITx } from '../../shared/ITx';
import { MONGODB_URI } from '../config';
import {IDB, TDBBuildingStatus } from '../db/IDB';
import { InMemoryDB } from '../db/InMemoryDB';
import { MongoDB } from '../db/MongoDB';
import { genLogger } from '../logger/LoggerFactory';
import {
  generateBlockResponseWithTransaction,
  generateBlockTransaction,
  generateContractDeployTransaction,
  generateRandomGetBlockResponse,
} from '../orbs-adapter/fake-blocks-generator';
import {
  blockResponseToBlock,
  blockResponseTransactionAsTx,
  blockResponseTransactionsToTxs,
} from '../transformers/blockTransform';
import { txToShortTx } from '../transformers/txTransform';

const logger: winston.Logger = genLogger(false, false, false);

describe('DB Tests', () => {
  testDb(new InMemoryDB(), 'InMemoryDB');
  testDb(new MongoDB(logger, MONGODB_URI), 'MongoDB');
});

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
      const block = blockResponseToBlock(generateRandomGetBlockResponse(1n));

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
      const block = blockResponseToBlock(generateRandomGetBlockResponse(1n));

      await db.storeBlock(block);

      const actual = await db.getBlockByHeight(block.blockHeight);
      expect(block).toEqual(actual);
    });

    it('should be able to retrive the latest blocks', async () => {
      const block1 = blockResponseToBlock(generateRandomGetBlockResponse(1n));
      const block2 = blockResponseToBlock(generateRandomGetBlockResponse(2n));
      const block3 = blockResponseToBlock(generateRandomGetBlockResponse(3n));
      const block4 = blockResponseToBlock(generateRandomGetBlockResponse(4n));
      const block5 = blockResponseToBlock(generateRandomGetBlockResponse(5n));
      await db.storeBlock(block1);
      await db.storeBlock(block2);
      await db.storeBlock(block3);
      await db.storeBlock(block4);
      await db.storeBlock(block5);

      const actual = await db.getLatestBlocks(3);
      expect(actual).toEqual([block5, block4, block3]);
    });

    it('should store and retrive txs', async () => {
      const block = generateRandomGetBlockResponse(1n);
      const txes = blockResponseTransactionsToTxs(block);

      await db.storeTxes(txes);

      for (const tx of txes) {
        const actual = await db.getTxById(tx.txId);
        expect(tx).toEqual(actual);
      }
    });

    it('should ignore case when retrive txs', async () => {
      const block = generateRandomGetBlockResponse(1n);
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
      const block10 = blockResponseToBlock(generateRandomGetBlockResponse(10n));
      const block11 = blockResponseToBlock(generateRandomGetBlockResponse(11n));
      const block12 = blockResponseToBlock(generateRandomGetBlockResponse(12n));

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
      const initial = await db.getHighestConsecutiveBlockHeight();

      await db.setHighestConsecutiveBlockHeight(initial + 123n);
      const actual = await db.getHighestConsecutiveBlockHeight();
      expect(actual).toEqual(initial + 123n);
      expect(actual).not.toEqual(initial);
    });

    it('should be able to update existing heighest consecutive block height ', async () => {
      const initial = await db.getHighestConsecutiveBlockHeight();

      await db.setHighestConsecutiveBlockHeight(123n);
      await db.setHighestConsecutiveBlockHeight(456n);
      const actual = await db.getHighestConsecutiveBlockHeight();
      expect(actual).toEqual(456n);
      expect(actual).not.toEqual(initial);
    });

    it('should have a db version 0.0.0 as the default', async () => {
      const actual = await db.getVersion();
      expect(actual).toEqual(0);
    });

    it('should store and retrieve the db version ', async () => {
      const initial = await db.getVersion();

      const testedDbVersion = 4;

      await db.setVersion(testedDbVersion);
      const actual = await db.getVersion();
      expect(actual).toEqual(testedDbVersion);
      expect(actual).not.toEqual(initial);
    });

    it('should be able to update existing db version ', async () => {
      const initial = await db.getVersion();

      await db.setVersion(4);
      await db.setVersion(5);
      const actual = await db.getVersion();
      expect(actual).toEqual(5);
      expect(actual).not.toEqual(initial);
    });

    it('Should have "None" as default "DB Building status"', async () => {
      const defaultValue = await db.getDBBuildingStatus();

      expect(defaultValue).toEqual('HasNotStarted');
    });

    it('Should be able to store, retrieve and update the "DB Building status"', async () => {
      const initial = await db.getDBBuildingStatus();
      const firstValue: TDBBuildingStatus = 'InWork';
      const secondValue: TDBBuildingStatus = 'Done';

      await db.setDBBuildingStatus(firstValue);
      const actualFirst = await db.getDBBuildingStatus();
      expect(actualFirst).toEqual(firstValue);

      await db.setDBBuildingStatus(secondValue);
      const actualSecond = await db.getDBBuildingStatus();
      expect(actualSecond).toEqual(secondValue);

      expect(actualFirst).not.toEqual(initial);
      expect(actualSecond).not.toEqual(initial);
    });

    it('Should have 0 as default "Latest Built block height"', async () => {
      const defaultValue = await db.getLastBuiltBlockHeight();

      expect(defaultValue).toEqual(0);
    });

    it('Should be able to store, retrieve and update the "Latest built block height"', async () => {
      const initial = await db.getLastBuiltBlockHeight();
      const firstValue: number = 100;
      const secondValue: number = 200;

      await db.setLastBuiltBlockHeight(firstValue);
      const actualFirst = await db.getLastBuiltBlockHeight();
      expect(actualFirst).toEqual(firstValue);

      await db.setLastBuiltBlockHeight(secondValue);
      const actualSecond = await db.getLastBuiltBlockHeight();
      expect(actualSecond).toEqual(secondValue);

      expect(actualFirst).not.toEqual(initial);
      expect(actualSecond).not.toEqual(initial);
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

    it('should retrive contract by name (Case insensetive)', async () => {
      const code: string = 'this is go code';
      const btx: BlockTransaction = generateContractDeployTransaction('Test-Contract', code);
      const block = generateBlockResponseWithTransaction(1n, btx);

      const tx = blockResponseTransactionAsTx(block, 0);
      await db.storeTxes([tx]);

      const actual = await db.getDeployContractTx('teSt-CONtrACT', true);
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

    it('should retrive all deployed contract', async () => {
      const code1: string = 'this is go code 1';
      const code2: string = 'this is go code 2';
      const btx1: BlockTransaction = generateContractDeployTransaction('test-contract1', code1);
      const block1 = generateBlockResponseWithTransaction(1n, btx1);
      const btx2: BlockTransaction = generateContractDeployTransaction('test-contract2', code2);
      const block2 = generateBlockResponseWithTransaction(2n, btx2);

      const tx1 = blockResponseTransactionAsTx(block1, 0);
      const tx2 = blockResponseTransactionAsTx(block2, 0);

      const actualBefore = await db.getDeployedContracts();
      expect([]).toEqual(actualBefore);

      await db.storeTxes([tx1, tx2]);

      const actualAfter = await db.getDeployedContracts();
      const expected: IContractGist[] = [
        {
          contractName: 'test-contract1',
          deployedBy: tx1.signerAddress,
          txId: tx1.txId,
        },
        {
          contractName: 'test-contract2',
          deployedBy: tx2.signerAddress,
          txId: tx2.txId,
        },
      ];
      expect(expected).toEqual(actualAfter);
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
