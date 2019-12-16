/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import winston from 'winston';
import { IOrbsBlocksPolling } from 'orbs-blocks-polling-js';
import { GAP_FILLER_ACTIVE } from '../config';
import { IDB } from '../db/IDB';
import { Storage } from '../storage/storage';
import { cron } from './Cron';
import { detectBlockChainGaps } from './GapsDetector';

const CHUCK_SIZE = 100;

export function fillGapsForever(
  logger: winston.Logger,
  storage: Storage,
  db: IDB,
  orbsBlocksPolling: IOrbsBlocksPolling,
  interval: number,
): void {
  if (GAP_FILLER_ACTIVE) {
    cron(async () => {
      logger.info(`Cron Job started.`);
      await fillGaps(logger, storage, orbsBlocksPolling);
    }, interval);
  }
}

async function storeBlockAt(
  height: bigint,
  logger: winston.Logger,
  storage: Storage,
  orbsBlocksPolling: IOrbsBlocksPolling,
): Promise<void> {
  const startTime = Date.now();
  const block = await orbsBlocksPolling.getBlockAt(height);
  logger.info(`getBlockAt finished, on height ${height} [${Date.now() - startTime}ms.]`);
  if (block) {
    await storage.handleNewBlock(block);
  } else {
    // report block not stored
  }
}

async function storeBlocksChunk(
  chunk: Array<bigint>,
  logger: winston.Logger,
  storage: Storage,
  orbsBlocksPolling: IOrbsBlocksPolling,
): Promise<void> {
  const promises: Array<Promise<void>> = [];
  for (const height of chunk) {
    promises.push(storeBlockAt(height, logger, storage, orbsBlocksPolling));
  }
  await Promise.all(promises);
  const heighestBlockHeight = chunk[chunk.length - 1];
  await storage.setHighestConsecutiveBlockHeight(heighestBlockHeight);
}

export async function fillGaps(logger: winston.Logger, storage: Storage, orbsBlocksPolling: IOrbsBlocksPolling): Promise<void> {
  const toHeight = await storage.getLatestBlockHeight();
  const fromHeight = (await storage.getHighestConsecutiveBlockHeight()) + 1n;
  logger.info(`Searching for gaps from ${fromHeight} to ${toHeight}`, { func: 'fillGaps' });
  const gaps = await detectBlockChainGaps(storage, fromHeight, toHeight);
  logger.info(`${gaps.length} missing blocks to fill`, { func: 'fillGaps' });

  for (let i = 0; i < gaps.length; i += CHUCK_SIZE) {
    const chunk = gaps.slice(i, i + CHUCK_SIZE);
    const startTime = Date.now();
    await storeBlocksChunk(chunk, logger, storage, orbsBlocksPolling);
    logger.info(
      `GapsFiller, blocks from ${chunk[0]} to ${chunk[chunk.length - 1]} stored [${Date.now() - startTime}ms.]`,
      { func: 'fillGaps' },
    );
  }
  await storage.setHighestConsecutiveBlockHeight(toHeight);
}
