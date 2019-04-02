/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IBlockSummary } from '../../shared/IBlock';
import { RootAction } from '../actions/rootAction';

export interface IBlockSummaryByHeight {
  [blockHeight: string]: IBlockSummary;
}

export function blocksSummaryByHeight(state: IBlockSummaryByHeight = {}, action: RootAction): IBlockSummaryByHeight {
  switch (action.type) {
    case 'NEW_BLOCK_SUMMARY': {
      const { blockSummary } = action;
      const { blockHeight } = blockSummary;
      return {
        ...state,
        [blockHeight]: blockSummary,
      };
    }

    default:
      return state;
  }
}
