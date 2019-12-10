import { IOrbsBlocksPolling } from 'orbs-blocks-polling-js';
import * as semver from 'semver';
import { Storage } from '../storage/storage';
import { IDB } from './IDB';

export interface IDBBuilderConfigurations {
  blocksBatchSize: number;
  /**
   * Dividing each 'batch' to chunks by this size.
   */
  blocksChunkSize: number;
}

export class DBBuilder {
  constructor(private db: IDB, private storage: Storage, private orbsBlocksPolling: IOrbsBlocksPolling, private dbBuilderConfigs: IDBBuilderConfigurations) {}

  public async init(prismVersion: string): Promise<void> {
    const hasBlocks = (await this.db.getLatestBlockHeight()) > 0n;

    if (!hasBlocks) {
      await this.rebuildFromZero();
    } else {
      const dbVersion = await this.db.getVersion();

      // A new version means that we want to rebuild the entire DB
      if (semver.gt(prismVersion, dbVersion)) {
        await this.db.clearAll();

        await this.setFreshDbStats(prismVersion);

        await this.rebuildFromZero();
      } else {
        const dbBuildingStatus = await this.db.getDBBuildingStatus();

        switch (dbBuildingStatus) {
          case 'Done':
            // No need to do anything, its the gaps filler's job now
            return;
          case 'InWork':
            // Continue from the last saved block
            const lastBuiltBlockHeight: number = 0;
            await this.rebuildFromBlockHeight(lastBuiltBlockHeight);
            break;
          case 'None':
            // Update to star work and start from zero
            await this.db.setDBBuildingStatus('InWork');
            await this.rebuildFromZero();
            break;
          default:
            throw new Error(`Unknown 'DB Building status of ${dbBuildingStatus}`);
        }
      }
    }

  }

  private async rebuildFromZero() {
    return this.rebuildFromBlockHeight(0);
  }

  private async rebuildFromBlockHeight(startingBlockHeight: number) {

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
