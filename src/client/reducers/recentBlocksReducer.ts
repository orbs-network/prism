/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IBlockSummary } from '../../shared/IBlock';
import { BlocksSummaryActions } from '../actions/blocksSummaryActions';
import { IRootState } from './rootReducer';

export type RecentBlocksHeights = string[];

export function recentBlocksHeights(
  state: RecentBlocksHeights = [],
  action: BlocksSummaryActions,
): RecentBlocksHeights {
  switch (action.type) {
    case 'NEW_BLOCK_SUMMARY':
      const result = [action.blockSummary.blockHeight, ...state];
      return result.length > 5 ? result.splice(0, 5) : result;
    default:
      return state;
  }
}

export const getRecentBlocksSummary = (state: IRootState): IBlockSummary[] =>
  state.recentBlocksHeights.map(blockHeight => state.blocksSummaryByHeight[blockHeight]);
