import { rawBlockToBlock } from '../block-transform/blockTransform';
import { generateRandomFakeBlock } from '../orbs-adapter/fake-blocks-generator';
import { InMemoryDB } from './InMemoryDB';
import { IDB } from './IDB';
import { MongoDB } from './MongoDB';
import { MONGODB_URI } from '../config';

testDb(new InMemoryDB(), 'InMemoryDB');
testDb(new MongoDB(MONGODB_URI), 'MongoDB');

function testDb(db: IDB, dbName: string) {
  describe(dbName, async () => {
    beforeEach(async () => {
      await db.init();
      await db.clearAll();
    });

    it('should store and retrive blocks', async () => {
      const rawBlock = generateRandomFakeBlock(1n);

      await db.storeBlock(rawBlockToBlock(rawBlock));

      const actual = await db.getBlockByHash(rawBlock.blockHash);
      expect(rawBlockToBlock(rawBlock)).toEqual(actual);
    });

    it('should be able to retrive blocks by height', async () => {
      const block = rawBlockToBlock(generateRandomFakeBlock(1n));

      await db.storeBlock(block);

      const actual = await db.getBlockByHeight(block.blockHeight);
      expect(block).toEqual(actual);
    });

    it('should store and retrive txs', async () => {
      const rawBlock = generateRandomFakeBlock(1n);

      await db.storeTx(rawBlock.transactions);

      for (const tx of rawBlock.transactions) {
        const actual = await db.getTxById(tx.txId);
        expect(tx).toEqual(actual);
      }
    });

    it('should be able to retrive the last block height', async () => {
      const block10 = rawBlockToBlock(generateRandomFakeBlock(10n));
      const block11 = rawBlockToBlock(generateRandomFakeBlock(11n));
      const block12 = rawBlockToBlock(generateRandomFakeBlock(12n));

      await db.storeBlock(block10);
      await db.storeBlock(block11);
      await db.storeBlock(block12);

      const actual = await db.getLatestBlockHeight();
      expect(actual.toString()).toEqual('12');
    });
  });
}
