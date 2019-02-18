import { IBlockSummary, IBlock } from '../../shared/IBlock';
import { RootAction } from '../actions/rootAction';
import { IRootState } from './rootReducer';

export interface IBlockData {
  isLoading: boolean;
  error?: string;
  block?: IBlock;
}

export interface IBlockEntry {
  summary?: IBlockSummary;
  blockData?: IBlockData;
}

export interface IBlocksByHeight {
  [blockHeight: string]: IBlockEntry;
}

function appendBlockToState(state: IBlocksByHeight, block: IBlock): IBlocksByHeight {
  const { blockHash } = block;
  const summary = state[blockHash] && state[blockHash].summary;
  return {
    ...state,
    [blockHash]: {
      summary,
      blockData: {
        isLoading: false,
        block,
      },
    },
  };
}

export function blocksByHash(state: IBlocksByHeight = {}, action: RootAction): IBlocksByHeight {
  switch (action.type) {
    case 'NEW_BLOCK_SUMMARY':
      return {
        ...state,
        [action.blockSummary.blockHash]: {
          summary: action.blockSummary,
        },
      };
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
    case 'LOAD_BLOCK_ERROR': {
      const { error, blockHash } = action;
      const summary = state[blockHash] && state[blockHash].summary;
      return {
        ...state,
        [blockHash]: {
          summary,
          blockData: {
            isLoading: false,
            error,
          },
        },
      };
    }
    default:
      return state;
  }
}

export const getBlockData = (state: IRootState, blockHash: string): IBlockData =>
  state.blocksByHash[blockHash] && state.blocksByHash[blockHash].blockData;

export const isBlockLoading = (state: IRootState, blockHash: string): boolean => {
  const blockData = getBlockData(state, blockHash);
  return blockData && blockData.isLoading;
};
