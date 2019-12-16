import { IOrbsBlocksPolling } from 'orbs-blocks-polling-js';
import semver from 'semver';
import { chunk } from 'lodash';
import fill from 'fill-range';
import { IDB } from './IDB';
import { Storage } from '../storage/storage';
import winston from 'winston';
import {increaseDbBuilderBuiltBlocks} from '../metrics/prometheusMetrics';
import {DBBuilderError} from './DBBuilderError';

export interface IDBBuilderConfigurations {
  blocksBatchSize: number;
  /**
   * Dividing each 'batch' to chunks of concurrent promises by this size.
   */
  maxParallelPromises: number;
}

export class DBBuilder {
  constructor(private db: IDB, private storage: Storage, private orbsBlocksPolling: IOrbsBlocksPolling,
              private logger: winston.Logger, private dbBuilderConfigs: IDBBuilderConfigurations) {}

  public async init(prismVersion: string): Promise<void> {
    try {
      const hasBlocks = (await this.db.getLatestBlockHeight()) > 0n;

      if (!hasBlocks) {
        await this.setDbVersion(prismVersion);
        await this.rebuildFromScratch();
      } else {
        const dbVersion = await this.db.getVersion();

        // In the rare case that Prism has a lower version than the DB, throw an error as
        // this case should never happen
        if (semver.lt(prismVersion, dbVersion)) {
          throw new DBBuilderError('LowerDbVersion', `Db Builder version is '${prismVersion}' while Db version is ${dbVersion}`);
        } else if (semver.gt(prismVersion, dbVersion)) { // A new version means that we want to rebuild the entire DB
          await this.db.clearAll();

          await this.setDbVersion(prismVersion);

          await this.rebuildFromScratch();
        } else {
          const dbBuildingStatus = await this.db.getDBBuildingStatus();

          switch (dbBuildingStatus) {
            case 'Done':
              // No need to do anything, its the gaps filler's job now
              return;
            case 'InWork':
              // Continue from the last saved block
              const lastBuiltBlockHeight = await this.db.getLastBuiltBlockHeight();
              await this.buildFromBlockHeightWithStateSignaling(Number(lastBuiltBlockHeight) + 1);
              break;
            case 'HasNotStarted':
              // DEV_NOTE : This is a physically possible situation, though in a normal function of the program, we should
              // not get here and this code is here only to cover all cases.
              this.logger.warn(`WEIRED : Got DB building status of ${dbBuildingStatus} while having db version already set, we should not have gotten here`);

              // Start building from scratch
              await this.rebuildFromScratch();
              break;
            default:
              throw new DBBuilderError('InvalidDbBuildingStatus', `Unknown 'DB Building status of ${dbBuildingStatus}`);
          }
        }
      }

      this.logger.info('DB Builder finished successfully');
    } catch (e) {
      if (e instanceof DBBuilderError) {
        throw e;
      } else {
        this.logger.error(`Error while building DB: ${e}`);
      }
    }
  }

  private async rebuildFromScratch() {
    return this.buildFromBlockHeightWithStateSignaling(1);
  }

  private async buildFromBlockHeightWithStateSignaling(startingBlockHeight: number) {
    await this.db.setDBBuildingStatus('InWork');

    await this.buildFromBlockHeight(startingBlockHeight);

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
        this.logger.error(`Exception while working on block group ${blockHeightsGroup[0]}-${blockHeightsGroup[blockHeightsGroup.length - 1]}`);
        this.logger.error(e);
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

    const hrStart = process.hrtime();
    for (const blocksChunk of chunks) {
      const promises = blocksChunk.map(blockHeight => this.getAndStoreBlock(BigInt(blockHeight))
          .then(() => successCount++ )
          .catch(e => {
            errorCount++;
            return e;
          }));

      await Promise.all(promises);
    }

    const hrEnd = process.hrtime(hrStart);
    this.logger.info(`Finished fetching and storing for range ${blocksRange} with ${successCount} success and ${errorCount} errors. ${hrEnd[0]} seconds, ${(hrEnd[1] / 1_000_000).toFixed(3)} ms`);

    increaseDbBuilderBuiltBlocks(successCount);
  }

  private async getAndStoreBlock(blockHeight: bigint): Promise<void> {
    const block = await this.orbsBlocksPolling.getBlockAt(blockHeight);

    if (block) {
      try {
        await this.storage.handleNewBlock(block);
      } catch (e) {
        this.logger.error(`Failed storing block ${blockHeight} - ${e}`);
        throw e;
      }
    } else {
      this.logger.error(`Got empty block for ${blockHeight}`);
      throw new Error(`ERROR : Gotnpm no block response for block ${blockHeight}`);
    }
  }

  private async setDbVersion(prismVersion: string) {
    await this.db.setVersion(prismVersion);
  }
}
