/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IRawBlock } from '../../shared/IRawData';

export interface INewBlocksHandler {
  handleNewBlock(block: IRawBlock): Promise<void>;
}

export interface IOrbsAdapter {
  initPooling(poolingInterval: number): Promise<void>;
  RegisterToNewBlocks(handler: INewBlocksHandler): void;
  UnregisterFromNewBlocks(handler: INewBlocksHandler): void;
  dispose(): void;
  getBlockAt(height: bigint): Promise<IRawBlock>;
  getLatestKnownHeight(): Promise<bigint>;
}
