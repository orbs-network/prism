import { InMemoryDB } from '../db/InMemoryDB';
import { fillGaps } from '../gaps-filler/GapsFiller';
import { OrbsAdapter } from '../orbs-adapter/OrbsAdapter';
import { MockOrbsClient } from '../orbs-client/MockOrbsClient';
import { Storage } from '../storage/storage';
import { waitUntil } from './TimeUtils';

describe('Gaps Filler', () => {
  let db: InMemoryDB;
  let orbsAdapter: OrbsAdapter;
  let orbsClient: MockOrbsClient;
  let storage: Storage;

  beforeEach(async () => {
    db = new InMemoryDB();
    await db.init();

    orbsClient = new MockOrbsClient();
    orbsAdapter = new OrbsAdapter(orbsClient, 25); // fast pooling, every 25ms.
    storage = new Storage(db);
    orbsAdapter.RegisterToNewBlocks(storage);
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
    await fillGaps(storage, orbsAdapter);

    // make sure that the storage holds the all 15 blocks
    for (let i = 1; i <= 15; i++) {
      const block = await storage.getBlockByHeight(i.toString());
      expect(block).not.toBeNull();
    }
  });

  it('should update the heighest consecutive block height after filling the gap', async () => {
    // append 10 blocks to orbs block chain (No one is listenning)
    orbsClient.generateBlocks(10);

    // start orbs adapter scheduler (Will start from height 10 + 1)
    await orbsAdapter.init();

    // append 5 blocks to orbs block chain
    orbsClient.generateBlocks(5);

    // let the scheduler catch up with the 5 new blocks
    await waitUntil(async () => (await storage.getLatestBlockHeight()) === 15n);

    // fill the gap from 1 to 10
    await fillGaps(storage, orbsAdapter);

    // make sure that the storage holds the all 15 blocks
    const actual = await storage.getHeighestConsecutiveBlockHeight();
    expect(actual).toBe(15n);
  });
});
