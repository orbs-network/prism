import { OrbsAdapter } from '../orbs-adapter/OrbsAdapter';
import { Storage } from '../storage/storage';

export class GapsFiller {
  constructor(private storage: Storage, private orbsAdapter: OrbsAdapter) {}

  public async fillGaps(): Promise<void> {
    const latestHeight = await this.storage.getLatestBlockHeight();
    console.log(`GapsFiller, latestHeight:${latestHeight}`);
    for (let height = 1n; height < latestHeight; height++) {
      console.log(`GapsFiller, do we have block at ${latestHeight}?`);
      const storageBlock = await this.storage.getBlockByHeight(height.toString());
      if (!storageBlock) {
        console.log(`GapsFiller, nop. Ask Orbs for this block`);
        const block = await this.orbsAdapter.getBlockAt(height);
        await this.storage.handleNewBlock(block);
        console.log(`GapsFiller, block at ${height} stored`);
      } else {
        console.log(`GapsFiller, yeap. Moving on`);
      }
    }
  }
}
