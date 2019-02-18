import { InMemoryDB } from '../db/InMemoryDB';
import { generateRandomFakeBlock } from '../orbs-adapter/fake-blocks-generator';
import { Storage } from './storage';
import { rawBlockToBlock, rawTxToTx } from '../block-transform/blockTransform';
import { ISearchResult } from '../../shared/ISearchResult';
import { uint8ArrayToString } from '../hash-converter/hashConverter';

describe('storage', () => {
  it('should store and retrive blocks', async () => {
    const db = new InMemoryDB();
    await db.init();
    const storage = new Storage(db);
    const block = generateRandomFakeBlock();
    await storage.handleNewBlock(block);

    const expected = rawBlockToBlock(block);
    const actual = await storage.getBlockByHash(uint8ArrayToString(block.blockHash));
    expect(expected).toEqual(actual);
  });

  it('should store and retrive txs', async () => {
    const db = new InMemoryDB();
    await db.init();
    const storage = new Storage(db);
    const block = generateRandomFakeBlock();
    await storage.handleNewBlock(block);

    for (const tx of block.transactions) {
      const actual = await storage.getTx(uint8ArrayToString(tx.txId));
      expect(rawTxToTx(block, tx)).toEqual(actual);
    }
  });

  describe('find', () => {
    it('should be able to find a block by hash', async () => {
      const db = new InMemoryDB();
      await db.init();
      const storage = new Storage(db);
      const block1 = generateRandomFakeBlock();
      const block2 = generateRandomFakeBlock();
      await storage.handleNewBlock(block1);
      await storage.handleNewBlock(block2);

      const expected: ISearchResult = { type: 'block', block: rawBlockToBlock(block2) };
      const actual = await storage.search(uint8ArrayToString(block2.blockHash));
      expect(expected).toEqual(actual);
    });

    it('should be able to find a tx by id', async () => {
      const db = new InMemoryDB();
      await db.init();
      const storage = new Storage(db);
      const block1 = generateRandomFakeBlock();
      const block2 = generateRandomFakeBlock();
      await storage.handleNewBlock(block1);
      await storage.handleNewBlock(block2);

      const tx = block2.transactions[0];
      const expected: ISearchResult = {
        type: 'tx',
        tx: {
          txId: uint8ArrayToString(tx.txId),
          blockHash: uint8ArrayToString(block2.blockHash),
          data: tx.data,
        },
      };
      const actual = await storage.search(uint8ArrayToString(block2.transactions[0].txId));
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
