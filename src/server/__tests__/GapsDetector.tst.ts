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

    const latestHeight = await storage.getLatestBlockHeight();
    const actual = await detectBlockChainGaps(storage, 1n, latestHeight);
    expect(actual).toEqual([4n, 5n, 9n]);
  });

  it('should detect gaps in the storage, starting from specific height', async () => {
    const db: IDB = new InMemoryDB();
    await db.init();
    const storage: Storage = new Storage(db);
    await storage.handleNewBlock(generateRandomRawBlock(6n));
    await storage.handleNewBlock(generateRandomRawBlock(7n));
    await storage.handleNewBlock(generateRandomRawBlock(10n));
    await storage.handleNewBlock(generateRandomRawBlock(20n));

    const actual = await detectBlockChainGaps(storage, 4n, 15n);
    expect(actual).toEqual([4n, 5n, 8n, 9n, 11n, 12n, 13n, 14n, 15n]);
  });
});
