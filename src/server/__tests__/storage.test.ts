/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { BlockTransaction } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { IContractData, IShortTx } from '../../shared/IContractData';
import { ISearchResult } from '../../shared/ISearchResult';
import { InMemoryDB } from '../db/InMemoryDB';
import {
  generateBlockTransaction,
  generateContractDeployTransaction,
  generateRandomRawBlock,
  generateRawBlockWithTransaction,
} from '../orbs-adapter/fake-blocks-generator';
import { Storage } from '../storage/storage';
import { rawBlockToBlock } from '../transformers/blockTransform';
import { rawTxToShortTx, rawTxToTx } from '../transformers/txTransform';
import { processContractsExecutionOrder, fillGaps } from '../gaps-filler/GapsFiller';
import { genLogger } from '../logger/LoggerFactory';
import * as winston from 'winston';

describe('storage', () => {
  const logger: winston.Logger = genLogger(false, false, false);

  it('should store and retrive blocks', async () => {
    const db = new InMemoryDB();
    await db.init();
    const storage = new Storage(db);
    const block = generateRandomRawBlock(1n);
    await storage.handleNewBlock(block);

    const expected = rawBlockToBlock(block);
    const actual = await storage.getBlockByHash(block.blockHash);
    expect(expected).toEqual(actual);
  });

  it('should store and retrive txs', async () => {
    const db = new InMemoryDB();
    await db.init();
    const storage = new Storage(db);
    const block = generateRandomRawBlock(1n);
    await storage.handleNewBlock(block);
    const txes = block.transactions.map(rawTxToTx);

    for (const tx of txes) {
      const actual = await storage.getTx(tx.txId);
      expect(tx).toEqual(actual);
    }
  });

  describe('find', () => {
    it('should be able to find a block by hash', async () => {
      const db = new InMemoryDB();
      await db.init();
      const storage = new Storage(db);
      const block1 = generateRandomRawBlock(1n);
      const block2 = generateRandomRawBlock(2n);
      await storage.handleNewBlock(block1);
      await storage.handleNewBlock(block2);

      const expected: ISearchResult = { type: 'block', block: rawBlockToBlock(block2) };
      const actual = await storage.search(block2.blockHash);
      expect(expected).toEqual(actual);
    });

    it('should be able to find a tx by id', async () => {
      const db = new InMemoryDB();
      await db.init();
      const storage = new Storage(db);
      const block1 = generateRandomRawBlock(1n);
      const block2 = generateRandomRawBlock(2n);
      await storage.handleNewBlock(block1);
      await storage.handleNewBlock(block2);

      const expected: ISearchResult = {
        type: 'tx',
        tx: rawTxToTx(block2.transactions[0], 0),
      };
      const actual = await storage.search(block2.transactions[0].txId);
      expect(expected).toEqual(actual);
    });

    it('should return null result when nothing found', async () => {
      const db = new InMemoryDB();
      await db.init();
      const storage = new Storage(db);

      const expected: ISearchResult = null;
      const actual = await storage.search('fake hash');
      expect(expected).toEqual(actual);
    });

    it('should return contract data by contract name', async () => {
      const contractName: string = 'test-contract';
      const code: string = 'This is Go code';
      const deployTx: BlockTransaction = generateContractDeployTransaction(contractName, code);
      const deployBlock = generateRawBlockWithTransaction(1n, deployTx);
      const tx1 = generateBlockTransaction(contractName, 'some-method1');
      const tx2 = generateBlockTransaction(contractName, 'some-method2');
      const tx3 = generateBlockTransaction(contractName, 'some-method3');
      const rawBlock2 = generateRawBlockWithTransaction(2n, [tx1, tx2]);
      const rawBlock3 = generateRawBlockWithTransaction(3n, tx3);

      const db = new InMemoryDB();
      await db.init();
      const storage = new Storage(db);
      await storage.handleNewBlock(deployBlock);
      await storage.handleNewBlock(rawBlock2);
      await storage.handleNewBlock(rawBlock3);

      await fillGaps(logger, storage, null);
      await processContractsExecutionOrder(db);

      const block2tx0: IShortTx = rawTxToShortTx(rawBlock2.transactions[0], 0);
      const block2tx1: IShortTx = rawTxToShortTx(rawBlock2.transactions[1], 1);
      const block3tx3: IShortTx = rawTxToShortTx(rawBlock3.transactions[0], 2);

      const expected: IContractData = {
        code,
        contractName,
        blockInfo: {
          2: {
            stateDiff: null,
            txes: [block2tx1, block2tx0],
          },
          3: {
            stateDiff: null,
            txes: [block3tx3],
          },
        },
      };
      const actual = await storage.getContractData(contractName);
      expect(expected).toEqual(actual);
    });
  });
});
