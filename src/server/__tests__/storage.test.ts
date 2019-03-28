/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { ISearchResult } from '../../shared/ISearchResult';
import { rawBlockToBlock } from '../block-transform/blockTransform';
import { InMemoryDB } from '../db/InMemoryDB';
import { generateRandomRawBlock } from '../orbs-adapter/fake-blocks-generator';
import { Storage } from '../storage/storage';

describe('storage', () => {
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

    for (const tx of block.transactions) {
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

      const tx = block2.transactions[0];
      const expected: ISearchResult = {
        type: 'tx',
        tx,
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
  });
});
