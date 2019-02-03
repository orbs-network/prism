import { IBlockSummary, IBlock } from '../shared/IBlock';
import { OrbsAdaper } from './orbs-adapter';
import { Storage } from './storage';

export class Indexer {
  constructor(private orbsAdapter: OrbsAdaper, private storage: Storage) {
    this.listenToNewBlocks();
  }

  private listenToNewBlocks(): void {
    this.orbsAdapter.RegisterToNewBlocks(block => this.onNewBlock(block));
  }

  private onNewBlock(newBlock: IBlock): void {
    this.storage.StoreBlock(newBlock);
  }
}
