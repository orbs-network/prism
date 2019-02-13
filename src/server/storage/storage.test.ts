import { InMemoryDB } from '../db/InMemoryDB';
import { generateRandomFakeBlock } from '../orbs-adapter/fake-blocks-generator';
import { Storage } from './storage';
import { rawBlockToBlock } from '../block-transform/blockTransform';
import { ISearchResult } from '../../shared/ISearchResult';

describe('storage', () => {
  it('should store and retrive blocks', async () => {
    const db = new InMemoryDB();
    await db.init();
    const storage = new Storage(db);
    const block = generateRandomFakeBlock();
    await storage.handleNewBlock(block);

    const expected = rawBlockToBlock(block);
    const actual = await storage.getBlock(block.hash);
    expect(expected).toEqual(actual);
  });

  it('should store and retrive txs', async () => {
    const db = new InMemoryDB();
    await db.init();
    const storage = new Storage(db);
    const block = generateRandomFakeBlock();
    await storage.handleNewBlock(block);

    for (const tx of block.txs) {
      const actual = await storage.getTx(tx.hash);
      expect(tx).toEqual(actual);
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
      const actual = await storage.findHash(block2.hash);
      expect(expected).toEqual(actual);
    });

    it('should be able to find a tx by hash', async () => {
      const db = new InMemoryDB();
      await db.init();
      const storage = new Storage(db);
      const block1 = generateRandomFakeBlock();
      const block2 = generateRandomFakeBlock();
      await storage.handleNewBlock(block1);
      await storage.handleNewBlock(block2);

      const expected: ISearchResult = { type: 'tx', tx: block2.txs[0] };
      const actual = await storage.findHash(block2.txs[0].hash);
      expect(expected).toEqual(actual);
    });

    it('should return null result when nothing found', async () => {
      const db = new InMemoryDB();
      await db.init();
      const storage = new Storage(db);

      const expected: ISearchResult = null;
      const actual = await storage.findHash('fake hash');
      expect(expected).toEqual(actual);
    });
  });
});
