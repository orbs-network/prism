/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IBlockSummary, IBlock } from '../../shared/IBlock';
import { RootAction } from '../actions/rootAction';
import { IRootState } from './rootReducer';

export interface IBlockData {
  isLoading: boolean;
  error: string;
  block: IBlock;
}

export interface IBlocksByHeight {
  [blockHeight: string]: IBlockData;
}

function appendBlockToState(state: IBlocksByHeight, block: IBlock): IBlocksByHeight {
  const { blockHeight } = block;
  return {
    ...state,
    [blockHeight]: {
      isLoading: false,
      error: null,
      block,
    },
  };
}

export function blocksByHeight(state: IBlocksByHeight = {}, action: RootAction): IBlocksByHeight {
  switch (action.type) {
    case 'LOAD_BLOCK_COMPLETED': {
      const { block } = action;
      return appendBlockToState(state, block);
    }
    case 'SEARCH_COMPLETED': {
      const { searchResult } = action;
      if (searchResult.type === 'block') {
        return appendBlockToState(state, searchResult.block);
      } else {
        return state;
      }
    }

    case 'LOAD_BLOCK_STARTED': {
      const { blockHeight } = action;
      return {
        ...state,
        [blockHeight]: {
          isLoading: true,
          block: null,
          error: null,
        },
      };
    }

    case 'LOAD_BLOCK_ERROR': {
      const { error, blockHeight } = action;
      return {
        ...state,
        [blockHeight]: {
          isLoading: false,
          block: null,
          error,
        },
      };
    }
    default:
      return state;
  }
}

export const getBlockData = (state: IRootState, blockHeight: string): IBlockData => state.blocksByHeight[blockHeight];

export const isBlockLoading = (state: IRootState, blockHeight: string): boolean => {
  const blockData = getBlockData(state, blockHeight);
  return blockData && blockData.isLoading;
};
