import { rawBlockToBlock } from '../block-transform/blockTransform';
import { generateRandomFakeBlock } from '../orbs-adapter/fake-blocks-generator';
import { InMemoryDB } from './InMemoryDB';

describe('InMemoryDB', () => {
  let db: InMemoryDB;
  beforeEach(async () => {
    db = new InMemoryDB();
    await db.init();
    await db.clearAll();
  });

  it('should store and retrive blocks', async () => {
    const rawBlock = generateRandomFakeBlock();

    await db.storeBlock(rawBlockToBlock(rawBlock));

    const actual = await db.getBlockByHash(rawBlock.blockHash);
    expect(rawBlockToBlock(rawBlock)).toEqual(actual);
  });

  it('should be able to retrive blocks by height', async () => {
    const block = rawBlockToBlock(generateRandomFakeBlock());

    await db.storeBlock(block);

    const actual = await db.getBlockByHeight(block.blockHeight);
    expect(block).toEqual(actual);
  });

  it('should store and retrive txs', async () => {
    const rawBlock = generateRandomFakeBlock();

    await db.storeTx(rawBlock.transactions);

    for (const tx of rawBlock.transactions) {
      const actual = await db.getTxById(tx.txId);
      expect(tx).toEqual(actual);
    }
  });
});