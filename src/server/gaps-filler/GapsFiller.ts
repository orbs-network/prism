import { OrbsAdapter } from '../orbs-adapter/OrbsAdapter';
import { Storage } from '../storage/storage';

export class GapsFiller {
  constructor(private storage: Storage, private orbsAdapter: OrbsAdapter) {}

  public async fillGaps(): Promise<void> {
    const latestHeight = await this.storage.getLatestBlockHeight();
    for (let height = 1n; height < latestHeight; height++) {
      const storageBlock = await this.storage.getBlockByHeight(height.toString());
      if (!storageBlock) {
        const block = await this.orbsAdapter.getBlockAt(height);
        await this.storage.handleNewBlock(block);
      }
    }
    //
  }
}
