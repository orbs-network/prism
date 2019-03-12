import { InMemoryDB } from '../db/InMemoryDB';
import { OrbsAdapter } from '../orbs-adapter/OrbsAdapter';
import { MockOrbsClient } from '../orbs-client/MockOrbsClient';
import { Storage } from '../storage/storage';
import { GapsFiller } from '../gaps-filler/GapsFiller';

const delay = (time: number) => new Promise(resolve => setTimeout(() => resolve(), time));
export async function waitUntil(
  predicate: () => Promise<boolean>,
  timeout: number = 2_000,
  interval: number = 50,
): Promise<void> {
  const endTime = Date.now() + timeout;
  while (endTime > Date.now()) {
    if (await predicate()) {
      return;
    }

    await delay(interval);
  }

  throw new Error('waitUtil reached timeout');
}

describe('Gaps Filler', () => {
  let db: InMemoryDB;
  let orbsAdapter: OrbsAdapter;
  let orbsClient: MockOrbsClient;
  let storage: Storage;
  let gapsFiller: GapsFiller;

  beforeEach(async () => {
    db = new InMemoryDB();
    await db.init();

    orbsClient = new MockOrbsClient();
    orbsAdapter = new OrbsAdapter(orbsClient, 25); // fast pooling, every 25ms.
    storage = new Storage(db);
    orbsAdapter.RegisterToNewBlocks(storage);
    gapsFiller = new GapsFiller(storage, orbsAdapter);
  });

  it('should fill all the missing blocks', async () => {
    // append 10 blocks to orbs block chain (No one is listenning)
    orbsClient.generateBlocks(10);

    // start orbs adapter scheduler (Will start from height 10 + 1)
    await orbsAdapter.init();

    // append 5 blocks to orbs block chain
    orbsClient.generateBlocks(5);

    // let the scheduler catch up with the 5 new blocks
    await waitUntil(async () => (await storage.getLatestBlockHeight()) === 15n);

    // make sure that the storage holds the 5 new blocks [11..15]
    for (let i = 11; i <= 15; i++) {
      const block = await storage.getBlockByHeight(i.toString());
      expect(block).not.toBeNull();
    }

    // fill the gap from 1 to 10
    await gapsFiller.fillGaps();

    // make sure that the storage holds the all 15 blocks
    for (let i = 1; i <= 15; i++) {
      const block = await storage.getBlockByHeight(i.toString());
      expect(block).not.toBeNull();
    }
  });
});
