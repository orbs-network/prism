import { IOrbsBlocksPolling } from 'orbs-blocks-polling-js';
import * as semver from 'semver';
import { Storage } from '../storage/storage';
import { IDB } from './IDB';

export class DBBuilder {
  constructor(private db: IDB, private storage: Storage, private orbsBlocksPolling: IOrbsBlocksPolling) {}

  public async init(prismVersion: string): Promise<void> {
    const hasBlocks = (await this.db.getLatestBlockHeight()) > 0n;

    if (hasBlocks) {
      const dbVersion = await this.db.getVersion();

      if (semver.gt(prismVersion, dbVersion)) {
        await this.db.clearAll();

        await this.setFreshDbStats(prismVersion);
      }
    }

    await this.rebuildDb();
  }

  private async rebuildDb(): Promise<void> {
    const latestHeight = await this.orbsBlocksPolling.getLatestKnownHeight();

    for (let h = 1n; h <= latestHeight; h++) {
      await this.getAndStoreBlock(h);
    }
  }

  private async getAndStoreBlock(blockHeight: bigint): Promise<void> {
    const block = await this.orbsBlocksPolling.getBlockAt(blockHeight);

    if (block) {
      await this.storage.handleNewBlock(block);
    } else {
      throw new Error(`ERROR : Got no block response for block ${blockHeight}`);
    }
  }

  private async setFreshDbStats(prismVersion: string) {
    await this.db.setVersion(prismVersion);
  }
}
