import { Storage } from '../storage/storage';
import { IDB } from '../db/IDB';
import { InMemoryDB } from '../db/InMemoryDB';
import { generateRandomRawBlock } from '../orbs-adapter/fake-blocks-generator';
import { detectBlockChainGaps } from '../gaps-filler/GapsDetector';

describe('Gaps Filler', () => {
  it('should detect gaps in the storage', async () => {
    const db: IDB = new InMemoryDB();
    await db.init();
    const storage: Storage = new Storage(db);
    await storage.handleNewBlock(generateRandomRawBlock(1n));
    await storage.handleNewBlock(generateRandomRawBlock(2n));
    await storage.handleNewBlock(generateRandomRawBlock(3n));
    await storage.handleNewBlock(generateRandomRawBlock(6n));
    await storage.handleNewBlock(generateRandomRawBlock(7n));
    await storage.handleNewBlock(generateRandomRawBlock(8n));
    await storage.handleNewBlock(generateRandomRawBlock(10n));

    const actual = await detectBlockChainGaps(storage);
    expect(actual).toEqual([4n, 5n, 9n]);
  });
});
