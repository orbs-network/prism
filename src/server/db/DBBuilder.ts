import { IOrbsBlocksPolling } from 'orbs-blocks-polling-js';
import * as semver from 'semver';
import { Storage } from '../storage/storage';
import { IDB } from './IDB';

export class DBBuilder {
  constructor(private db: IDB, private storage: Storage, private orbsBlocksPolling: IOrbsBlocksPolling) {}

  public async init(prismVersion: string): Promise<void> {
    const hasBlocks = (await this.db.getLatestBlockHeight()) > 0n;
    if (!hasBlocks) {
      await this.rebuildDb();
    } else {
      const dbVersion = await this.db.getVersion();
      if (semver.gt(prismVersion, dbVersion)) {
        await this.db.clearAll();
        await this.rebuildDb();
      }
    }
  }

  private async rebuildDb(): Promise<void> {
    const latestHeight = await this.orbsBlocksPolling.getLatestKnownHeight();
    for (let h = 1n; h <= latestHeight; h++) {
      const block = await this.orbsBlocksPolling.getBlockAt(h);
      await this.storage.handleNewBlock(block);
    }
  }
}
