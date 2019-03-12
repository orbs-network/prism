import { OrbsAdapter } from '../orbs-adapter/OrbsAdapter';
import { Storage } from '../storage/storage';
import { detectBlockChainGaps } from './GapsDetector';

export class GapsFiller {
  constructor(private storage: Storage, private orbsAdapter: OrbsAdapter) {}

  public async fillGaps(): Promise<void> {
    const gaps = await detectBlockChainGaps(this.storage);
    console.log(`${gaps} missing blocks to fill`);
    for (const height of gaps) {
      const block = await this.orbsAdapter.getBlockAt(height);
      await this.storage.handleNewBlock(block);
      console.log(`GapsFiller, block at ${height} stored`);
    }
  }
}
