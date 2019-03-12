import { OrbsAdapter } from '../orbs-adapter/OrbsAdapter';
import { Storage } from '../storage/storage';
import { detectBlockChainGaps } from './GapsDetector';

export class GapsFiller {
  constructor(private storage: Storage, private orbsAdapter: OrbsAdapter) {}

  public async fillGaps(): Promise<void> {
    const toHeight = await this.storage.getLatestBlockHeight();
    const fromHeight = (await this.storage.getHeighestConsecutiveBlockHeight()) + 1n;
    const gaps = await detectBlockChainGaps(this.storage, fromHeight, toHeight);
    console.log(`${gaps} missing blocks to fill`);
    for (const height of gaps) {
      const block = await this.orbsAdapter.getBlockAt(height);
      await this.storage.handleNewBlock(block);
      console.log(`GapsFiller, block at ${height} stored`);
    }
    await this.storage.setHeighestConsecutiveBlockHeight(toHeight);
  }
}
