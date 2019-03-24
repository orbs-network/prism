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

export interface IBlocksByHash {
  [blockHash: string]: IBlockData;
}

function appendBlockToState(state: IBlocksByHash, block: IBlock): IBlocksByHash {
  const { blockHash } = block;
  return {
    ...state,
    [blockHash]: {
      isLoading: false,
      error: null,
      block,
    },
  };
}

export function blocksByHash(state: IBlocksByHash = {}, action: RootAction): IBlocksByHash {
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
      const { blockHash } = action;
      return {
        ...state,
        [blockHash]: {
          isLoading: true,
          block: null,
          error: null,
        },
      };
    }

    case 'LOAD_BLOCK_ERROR': {
      const { error, blockHash } = action;
      return {
        ...state,
        [blockHash]: {
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

export const getBlockData = (state: IRootState, blockHash: string): IBlockData => state.blocksByHash[blockHash];

export const isBlockLoading = (state: IRootState, blockHash: string): boolean => {
  const blockData = getBlockData(state, blockHash);
  return blockData && blockData.isLoading;
};
