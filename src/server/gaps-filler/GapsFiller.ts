/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

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
  console.log(`Searching for gaps from ${fromHeight} to ${toHeight}`);
  const gaps = await detectBlockChainGaps(storage, fromHeight, toHeight);
  console.log(`${gaps.length} missing blocks to fill`);
  for (const height of gaps) {
    const block = await orbsAdapter.getBlockAt(height);
    if (block) {
      await storage.handleNewBlock(block);
      await storage.setHeighestConsecutiveBlockHeight(height);
      console.log(`GapsFiller, block at ${height} stored`);
    } else {
      // report block not stored
    }
  }
  await storage.setHeighestConsecutiveBlockHeight(toHeight);
}
