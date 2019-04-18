/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Storage } from '../storage/storage';
import winston = require('winston');

export async function detectBlockChainGaps(
  logger: winston.Logger,
  storage: Storage,
  fromHeight: bigint,
  toHeight: bigint,
): Promise<Array<bigint>> {
  const result: Array<bigint> = [];
  for (let height = fromHeight; height <= toHeight; height++) {
    logger.info(`Asking storage for block at ${height}?`, { func: 'detectBlockChainGaps' });
    const storageBlock = await storage.getBlockByHeight(height.toString());
    if (!storageBlock) {
      logger.info(`No block found in storage for height ${height}`);
      result.push(height);
    } else {
      logger.info(`A block found in storage for height ${height}`);
    }
  }

  return result;
}
