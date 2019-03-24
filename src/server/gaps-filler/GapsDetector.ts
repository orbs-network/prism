/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Storage } from '../storage/storage';

export async function detectBlockChainGaps(storage: Storage, fromHeight: bigint, toHeight: bigint): Promise<Array<bigint>> {
  const result: Array<bigint> = [];
  for (let height = fromHeight; height <= toHeight; height++) {
    const storageBlock = await storage.getBlockByHeight(height.toString());
    console.log(`[Gaps Detector], do we have block at ${height}?`);
    if (!storageBlock) {
      console.log(`[Gaps Detector], nop.`);
      result.push(height);
    } else {
      console.log(`[Gaps Detector], yeap.`);
    }
  }

  return result;
}
