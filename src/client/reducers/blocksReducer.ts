import { IBlockSummary, IBlock } from '../../shared/IBlock';
import { RootAction } from '../actions/rootAction';
import { IRootState } from './rootReducer';

export interface IBlockData {
  isLoading: boolean;
  error?: string;
  block?: IBlock;
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
