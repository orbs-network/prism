import { IRawBlock } from '../shared/IBlock';
import { IOrbsAdapter } from './orbs-adapter/IOrbsAdapter';
import { Storage } from './storage';

export class Indexer {
  constructor(private orbsAdapter: IOrbsAdapter, private storage: Storage) {
    this.listenToNewBlocks();
  }

  private listenToNewBlocks(): void {
    this.orbsAdapter.RegisterToNewBlocks(block => this.onNewBlock(block));
  }

  private async onNewBlock(newBlock: IRawBlock): Promise<void> {
    await this.storage.handleNewBlock(newBlock);
  }
}
