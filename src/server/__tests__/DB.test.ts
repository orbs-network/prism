import { rawBlockToBlock } from '../block-transform/blockTransform';
import { generateRandomRawBlock } from '../orbs-adapter/fake-blocks-generator';
import { InMemoryDB } from '../db/InMemoryDB';
import { IDB } from '../db/IDB';
import { MongoDB } from '../db/MongoDB';
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
      const rawBlock = generateRandomRawBlock(1n);

      await db.storeBlock(rawBlockToBlock(rawBlock));

      const actual = await db.getBlockByHash(rawBlock.blockHash);
      expect(rawBlockToBlock(rawBlock)).toEqual(actual);
    });

    it('should be able to retrive blocks by height', async () => {
      const block = rawBlockToBlock(generateRandomRawBlock(1n));

      await db.storeBlock(block);

      const actual = await db.getBlockByHeight(block.blockHeight);
      expect(block).toEqual(actual);
    });

    it('should store and retrive txs', async () => {
      const rawBlock = generateRandomRawBlock(1n);

      await db.storeTx(rawBlock.transactions);

      for (const tx of rawBlock.transactions) {
        const actual = await db.getTxById(tx.txId);
        expect(tx).toEqual(actual);
      }
    });

    it('should be able to retrive the last block height', async () => {
      const block10 = rawBlockToBlock(generateRandomRawBlock(10n));
      const block11 = rawBlockToBlock(generateRandomRawBlock(11n));
      const block12 = rawBlockToBlock(generateRandomRawBlock(12n));

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
      const inital = await db.getHeighestConsecutiveBlockHeight();
      expect(inital).toEqual(0n);

      await db.setHeighestConsecutiveBlockHeight(123n);
      const actual = await db.getHeighestConsecutiveBlockHeight();
      expect(actual).toEqual(123n);
    });
  });
}
