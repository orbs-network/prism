/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { combineReducers, Reducer } from 'redux';
import { blocksByHash, IBlocksByHash } from './blocksReducer';
import { blocksSummaryByHash, IBlockSummaryByHash } from './blocksSummaryReducer';
import { txsById, ITxsById } from './txsReducer';
import { recentBlocksHashs, RecentBlocksHashes } from './recentBlocksReducer';

export interface IRootState {
  txsById: ITxsById;
  blocksByHash: IBlocksByHash;
  blocksSummaryByHash: IBlockSummaryByHash;
  recentBlocksHashs: RecentBlocksHashes;
}

export const rootReducer: Reducer<IRootState> = combineReducers<IRootState>({
  txsById,
  blocksByHash,
  blocksSummaryByHash,
  recentBlocksHashs,
});
