/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { combineReducers, Reducer } from 'redux';
import { blocksByHeight, IBlocksByHeight } from './blocksReducer';
import { blocksSummaryByHeight, IBlockSummaryByHeight } from './blocksSummaryReducer';
import { txsById, ITxsById } from './txsReducer';
import { focusedContract, IFocusedContract } from './focusedContractReducer';
import { RecentBlocksHeights, recentBlocksHeights } from './recentBlocksReducer';
import { IContractsNames, contractsNames } from './contractsNamesReducer';

export interface IRootState {
  txsById: ITxsById;
  blocksByHeight: IBlocksByHeight;
  blocksSummaryByHeight: IBlockSummaryByHeight;
  recentBlocksHeights: RecentBlocksHeights;
  focusedContract: IFocusedContract;
  contractsNames: IContractsNames;
}

export const rootReducer: Reducer<IRootState> = combineReducers<IRootState>({
  txsById,
  blocksByHeight,
  blocksSummaryByHeight,
  recentBlocksHeights,
  focusedContract,
  contractsNames
});
