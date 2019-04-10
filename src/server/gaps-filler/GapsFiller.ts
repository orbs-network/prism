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
import * as winston from 'winston';

export function fillGapsForever(
  logger: winston.Logger,
  storage: Storage,
  orbsAdapter: OrbsAdapter,
  interval: number,
): void {
  cron(async () => {
    logger.info(`Cron Job started.`);
    await fillGaps(logger, storage, orbsAdapter);
  }, interval);
}

export async function fillGaps(logger: winston.Logger, storage: Storage, orbsAdapter: OrbsAdapter): Promise<void> {
  const toHeight = await storage.getLatestBlockHeight();
  const fromHeight = (await storage.getHeighestConsecutiveBlockHeight()) + 1n;
  logger.info(`Searching for gaps from ${fromHeight} to ${toHeight}`, { method: 'fillGaps' });
  const gaps = await detectBlockChainGaps(logger, storage, fromHeight, toHeight);
  logger.info(`${gaps.length} missing blocks to fill`, { method: 'fillGaps' });
  for (const height of gaps) {
    const block = await orbsAdapter.getBlockAt(height);
    if (block) {
      await storage.handleNewBlock(block);
      await storage.setHeighestConsecutiveBlockHeight(height);
      logger.info(`GapsFiller, block at ${height} stored`, { method: 'fillGaps' });
    } else {
      // report block not stored
    }
  }
  await storage.setHeighestConsecutiveBlockHeight(toHeight);
}
