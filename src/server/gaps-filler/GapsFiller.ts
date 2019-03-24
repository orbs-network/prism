import { OrbsAdapter } from '../orbs-adapter/OrbsAdapter';
import { Storage } from '../storage/storage';
import { detectBlockChainGaps } from './GapsDetector';
import { cron } from './Cron';

export function fillGapsForever(storage: Storage, orbsAdapter: OrbsAdapter, interval: number): void {
  cron(async () => {
    console.log(`Cron Job started.`);
    await fillGaps(storage, orbsAdapter);
  }, interval);
}

export async function fillGaps(storage: Storage, orbsAdapter: OrbsAdapter): Promise<void> {
  const toHeight = await storage.getLatestBlockHeight();
  const fromHeight = (await storage.getHeighestConsecutiveBlockHeight()) + 1n;
  const gaps = await detectBlockChainGaps(storage, fromHeight, toHeight);
  console.log(`${gaps.length} missing blocks to fill`);
  for (const height of gaps) {
    const block = await orbsAdapter.getBlockAt(height);
    await storage.handleNewBlock(block);
    await storage.setHeighestConsecutiveBlockHeight(height);
    console.log(`GapsFiller, block at ${height} stored`);
  }
  await storage.setHeighestConsecutiveBlockHeight(toHeight);
}
