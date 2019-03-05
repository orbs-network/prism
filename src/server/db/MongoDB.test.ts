import { rawBlockToBlock } from '../block-transform/blockTransform';
import { generateRandomFakeBlock } from '../orbs-adapter/fake-blocks-generator';
import { MongoDB } from './MongoDB';
import { MONGO_URL } from '../config';

describe.only('MongoDB', () => {
  let db: MongoDB;
  beforeEach(async () => {
    db = new MongoDB(MONGO_URL);
    await db.init();
    await db.clearAll();
  });

  it('should store and retrive blocks', async () => {
    const block = rawBlockToBlock(generateRandomFakeBlock());

    await db.storeBlock(block);

    const actual: any = await db.getBlockByHash(block.blockHash);
    expect(actual).toEqual(block);
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
