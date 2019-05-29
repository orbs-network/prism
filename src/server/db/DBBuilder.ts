import { IOrbsAdapter } from '../orbs-adapter/IOrbsAdapter';
import { Storage } from '../storage/storage';
import { IDB } from './IDB';

export class DBBuilder {
  constructor(private db: IDB, private storage: Storage, private orbsAdapter: IOrbsAdapter) {}

  public async init(): Promise<void> {
    const hasBlocks = (await this.db.getLatestBlockHeight()) > 0n;
    if (!hasBlocks) {
        await this.rebuildDb();
    }
  }

  private async rebuildDb(): Promise<void> {
    const latestHeight = await this.orbsAdapter.getLatestKnownHeight();
    for (let h = 1n; h <= latestHeight; h++) {
        const block = await this.orbsAdapter.getBlockAt(h);
        await this.storage.handleNewBlock(block);
    }
  }
}
