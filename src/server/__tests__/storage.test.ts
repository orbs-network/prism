/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { encodeHex } from 'orbs-client-sdk';
import { BlockTransaction } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import * as winston from 'winston';
import { IContractData, IShortTx, IContractGist } from '../../shared/IContractData';
import { ISearchResult } from '../../shared/ISearchResult';
import { InMemoryDB } from '../db/InMemoryDB';
import { genLogger } from '../logger/LoggerFactory';
import { generateBlockResponseWithTransaction, generateBlockTransaction, generateContractDeployTransaction, generateRandomGetBlockResponse } from '../orbs-adapter/fake-blocks-generator';
import { Storage } from '../storage/storage';
import { blockResponseToBlock, blockResponseTransactionAsTx, blockResponseTransactionsToTxs, blockTransactionToTx } from '../transformers/blockTransform';
import { txToShortTx } from '../transformers/txTransform';

describe('storage', () => {
  const logger: winston.Logger = genLogger(false, false, false);

  it('should store and retrive blocks', async () => {
    const db = new InMemoryDB();
    await db.init();
    const storage = new Storage(db);
    const block = generateRandomGetBlockResponse(1n);
    await storage.handleNewBlock(block);

    const expected = blockResponseToBlock(block);
    const blockHash = encodeHex(block.resultsBlockHash);
    const actual = await storage.getBlockByHash(blockHash);
    expect(expected).toEqual(actual);
  });

  it('should store and retrive txs', async () => {
    const db = new InMemoryDB();
    await db.init();
    const storage = new Storage(db);
    const block = generateRandomGetBlockResponse(1n);
    await storage.handleNewBlock(block);
    const txes = blockResponseTransactionsToTxs(block);

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
      const block1 = generateRandomGetBlockResponse(1n);
      const block2 = generateRandomGetBlockResponse(2n);
      await storage.handleNewBlock(block1);
      await storage.handleNewBlock(block2);

      const expected: ISearchResult = { type: 'block', block: blockResponseToBlock(block2) };
      const blockHash = encodeHex(block2.resultsBlockHash);
      const actual = await storage.search(blockHash);
      expect(expected).toEqual(actual);
    });

    it('should be able to find a tx by id', async () => {
      const db = new InMemoryDB();
      await db.init();
      const storage = new Storage(db);
      const block1 = generateRandomGetBlockResponse(1n);
      const block2 = generateRandomGetBlockResponse(2n);
      await storage.handleNewBlock(block1);
      await storage.handleNewBlock(block2);

      const block2Txes = blockResponseTransactionsToTxs(block2);

      const expected: ISearchResult = {
        type: 'tx',
        tx: block2Txes[0],
      };
      const actual = await storage.search(block2Txes[0].txId);
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

    it('should return All deployed contracts', async () => {
      const db = new InMemoryDB();
      await db.init();
      const storage = new Storage(db);

      const contract1Name: string = 'test-contract-1';
      const contract2Name: string = 'test-contract-2';
      const contract3Name: string = 'test-contract-3';
      const deploy1Tx: BlockTransaction = generateContractDeployTransaction(contract1Name, 'Dummy-code');
      const deploy2Tx: BlockTransaction = generateContractDeployTransaction(contract2Name, 'Dummy-code');
      const deploy3Tx: BlockTransaction = generateContractDeployTransaction(contract3Name, 'Dummy-code');

      await storage.handleNewBlock(generateBlockResponseWithTransaction(1n, deploy1Tx));
      await storage.handleNewBlock(generateBlockResponseWithTransaction(2n, deploy2Tx));
      await storage.handleNewBlock(generateBlockResponseWithTransaction(3n, deploy3Tx));

      const tx1 = blockTransactionToTx('1', 0, deploy1Tx);
      const tx2 = blockTransactionToTx('2', 0, deploy2Tx);
      const tx3 = blockTransactionToTx('3', 0, deploy3Tx);
      
      const actual = await storage.getAllDeployedContracts();
      const expected: IContractGist[] = [
        { 
          contractName: 'test-contract-1',
          deployedBy: tx1.signerAddress,
          txId: tx1.txId
         },
        { 
          contractName: 'test-contract-2',
          deployedBy: tx2.signerAddress,
          txId: tx2.txId
         },
        { 
          contractName: 'test-contract-3',
          deployedBy: tx3.signerAddress,
          txId: tx3.txId
         },
      ]
      expect(expected).toEqual(actual);

    });

    it('should return contract data by contract name', async () => {
      const contractName: string = 'test-contract';
      const code1: string = 'This is the 1st Go code';
      const code2: string = 'This is the 2nd Go code';
      const deployTx: BlockTransaction = generateContractDeployTransaction(contractName, code1, code2);
      const deployBlock = generateBlockResponseWithTransaction(1n, deployTx);
      const tx1 = generateBlockTransaction(contractName, 'some-method1');
      const tx2 = generateBlockTransaction(contractName, 'some-method2');
      const tx3 = generateBlockTransaction(contractName, 'some-method3');
      const block2 = generateBlockResponseWithTransaction(2n, [tx1, tx2]);
      const block3 = generateBlockResponseWithTransaction(3n, tx3);

      const db = new InMemoryDB();
      await db.init();
      const storage = new Storage(db);
      await storage.handleNewBlock(deployBlock);
      await storage.handleNewBlock(block2);
      await storage.handleNewBlock(block3);

      const block2tx0: IShortTx = txToShortTx(blockResponseTransactionAsTx(block2, 0), 1);
      const block2tx1: IShortTx = txToShortTx(blockResponseTransactionAsTx(block2, 1), 2);
      const block3tx3: IShortTx = txToShortTx(blockResponseTransactionAsTx(block3, 0), 3);

      const expected: IContractData = {
        code: [code1, code2],
        contractName,
        blocksInfo: {
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
