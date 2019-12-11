import { IOrbsBlocksPolling } from 'orbs-blocks-polling-js';
import semver from 'semver';
import { chunk } from 'lodash';
import fill from 'fill-range';
import { IDB } from './IDB';
import { Storage } from '../storage/storage';

export interface IDBBuilderConfigurations {
  blocksBatchSize: number;
  /**
   * Dividing each 'batch' to chunks of concurrent promises by this size.
   */
  maxParallelPromises: number;
}

export class DBBuilder {
  constructor(private db: IDB, private storage: Storage, private orbsBlocksPolling: IOrbsBlocksPolling, private dbBuilderConfigs: IDBBuilderConfigurations) {}

  public async init(prismVersion: string): Promise<void> {
    const hasBlocks = (await this.db.getLatestBlockHeight()) > 0n;

    if (!hasBlocks) {
      await this.rebuildFromScratch();
    } else {
      const dbVersion = await this.db.getVersion();

      // In the rare case that Prism has a lower version than the DB, do nothing.
      if (semver.lt(prismVersion, dbVersion)) {
        return;
      } else if (semver.gt(prismVersion, dbVersion)) { // A new version means that we want to rebuild the entire DB
        await this.db.clearAll();

        await this.setFreshDbStats(prismVersion);

        await this.rebuildFromScratch();
      } else {
        const dbBuildingStatus = await this.db.getDBBuildingStatus();

        switch (dbBuildingStatus) {
          case 'Done':
            // No need to do anything, its the gaps filler's job now
            return;
          case 'InWork':
            // Continue from the last saved block
            const lastBuiltBlockHeight = (await this.db.getLastBuiltBlockHeight());
            await this.buildFromBlockHeightWithStateSignaling(Number(lastBuiltBlockHeight) + 1);
            break;
          case 'None':
            // Start building from scratch
            await this.rebuildFromScratch();
            break;
          default:
            throw new Error(`Unknown 'DB Building status of ${dbBuildingStatus}`);
        }
      }
    }

  }

  private async rebuildFromScratch() {
    return this.buildFromBlockHeightWithStateSignaling(1);
  }

  private async buildFromBlockHeightWithStateSignaling(startingBlockHeight: number) {
    await this.db.setDBFillingMethod('DBBuilder');
    await this.db.setDBBuildingStatus('InWork');

    await this.buildFromBlockHeight(startingBlockHeight);

    await this.db.setDBFillingMethod('None');
    await this.db.setDBBuildingStatus('Done');
  }

  private async buildFromBlockHeight(startingBlockHeight: number) {
    const latestHeight = await this.orbsBlocksPolling.getLatestKnownHeight();

    const blockHeightsGroups = this.getAllRequiredBlockHeightsInGroups(startingBlockHeight, Number(latestHeight));

    for (const blockHeightsGroup of blockHeightsGroups) {
      try {
        await this.fetchAndStoreBlocks(blockHeightsGroup);

        // Save the latest built block
        await this.db.setLastBuiltBlockHeight(blockHeightsGroup[blockHeightsGroup.length - 1]);
      } catch (e) {
        console.error(`Exception while working on block group ${blockHeightsGroup[0]}-${blockHeightsGroup[blockHeightsGroup.length - 1]}`);
        console.error(e);
      }
    }
  }

  private getAllRequiredBlockHeightsInGroups(startBlock: number, endBlock: number): number[][] {
    const requiredBlocksHeights = fill(startBlock, endBlock) as number[];
    // Divide to groups
    const groups = chunk(requiredBlocksHeights, this.dbBuilderConfigs.blocksBatchSize);

    return groups;
  }

  private async fetchAndStoreBlocks(blockHeights: number[]) {
    const blocksRange = `${blockHeights[0]}-${blockHeights[blockHeights.length - 1]}`;
    console.info(`Fetching and storing blocks for the range ${blocksRange}`);

    const chunks = chunk(blockHeights, this.dbBuilderConfigs.maxParallelPromises);

    let errorCount = 0;
    let successCount = 0;

    for (const blocksChunk of chunks) {
      const promises = blocksChunk.map(blockHeight => this.getAndStoreBlock(BigInt(blockHeight))
          .then(() => successCount++ )
          .catch(e => {
            errorCount++;
            return e;
          }));

      await Promise.all(promises);
    }

    console.log(`Finished fetching and storing for range ${blocksRange} with ${successCount} success and ${errorCount} errors`);
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
