/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IBlockSummary } from '../../shared/IBlock';
import { RootAction } from '../actions/rootAction';

export interface IBlockSummaryByHash {
  [blockHash: string]: IBlockSummary;
}

export function blocksSummaryByHash(state: IBlockSummaryByHash = {}, action: RootAction): IBlockSummaryByHash {
  switch (action.type) {
    case 'NEW_BLOCK_SUMMARY': {
      const { blockSummary } = action;
      const { blockHash } = blockSummary;
      return {
        ...state,
        [blockHash]: blockSummary,
      };
    }

    default:
      return state;
  }
}
