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

const CHUCK_SIZE = 10;

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

async function storeBlockAt(height: bigint, storage: Storage, orbsAdapter: OrbsAdapter): Promise<void> {
  const block = await orbsAdapter.getBlockAt(height);
  if (block) {
    await storage.handleNewBlock(block);
  } else {
    // report block not stored
  }
}

async function storeBlocksChunk(chunk: Array<bigint>, storage: Storage, orbsAdapter: OrbsAdapter): Promise<void> {
  const promises: Array<Promise<void>> = [];
  for (const height of chunk) {
    promises.push(storeBlockAt(height, storage, orbsAdapter));
  }
  await Promise.all(promises);
  const heighestBlockHeight = chunk[chunk.length - 1];
  await storage.setHeighestConsecutiveBlockHeight(heighestBlockHeight);
}

export async function fillGaps(logger: winston.Logger, storage: Storage, orbsAdapter: OrbsAdapter): Promise<void> {
  const toHeight = await storage.getLatestBlockHeight();
  const fromHeight = (await storage.getHeighestConsecutiveBlockHeight()) + 1n;
  logger.info(`Searching for gaps from ${fromHeight} to ${toHeight}`, { func: 'fillGaps' });
  const gaps = await detectBlockChainGaps(logger, storage, fromHeight, toHeight);
  logger.info(`${gaps.length} missing blocks to fill`, { func: 'fillGaps' });

  for (let i = 0; i < gaps.length; i += CHUCK_SIZE) {
    const chunk = gaps.slice(i, i + CHUCK_SIZE);
    await storeBlocksChunk(chunk, storage, orbsAdapter);
    logger.info(`GapsFiller, blocks from ${chunk[0]} to ${chunk[chunk.length - 1]} stored`, { func: 'fillGaps' });
  }
  await storage.setHeighestConsecutiveBlockHeight(toHeight);
}
