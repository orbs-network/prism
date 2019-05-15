/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { loopInChunks } from '../chunker/LoopInChunks';
import { Storage } from '../storage/storage';
import winston = require('winston');

export async function detectBlockChainGaps(
  storage: Storage,
  fromHeight: bigint,
  toHeight: bigint,
): Promise<Array<bigint>> {
  const missingBlocks = await loopInChunks(fromHeight, toHeight, 100n, async idx => {
    const block = await storage.getBlockByHeight(idx.toString());
    return block ? null : idx;
  });
  return missingBlocks.filter(b => b !== null);
}
