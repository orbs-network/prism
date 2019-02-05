import { IBlockSummary, IBlock } from '../../shared/IBlock';
import { RootAction } from '../actions/rootAction';
import { IRootState } from './rootReducer';

export interface IBlockData {
  isLoading: boolean;
  error?: string;
  block: IBlock;
}

export interface IBlockEntry {
  summary?: IBlockSummary;
  blockData?: IBlockData;
}

export interface IBlocksByHash {
  [hash: string]: IBlockEntry;
}

function appendBlockToState(state: IBlocksByHash, block: IBlock): IBlocksByHash {
  const { hash } = block;
  const summary = state[hash] && state[hash].summary;
  return {
    ...state,
    [hash]: {
      summary,
      blockData: {
        isLoading: false,
        block,
      },
    },
  };
}

export function blocksByHash(state: IBlocksByHash = {}, action: RootAction): IBlockEntry {
  switch (action.type) {
    case 'NEW_BLOCK_SUMMARY':
      return {
        ...state,
        [action.blockSummary.hash]: {
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
      const { error, hash } = action;
      const summary = state[hash] && state[hash].summary;
      return {
        ...state,
        [hash]: {
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

export const getBlockData = (state: IRootState, hash: string): IBlockData =>
  state.blocksByHash[hash] && state.blocksByHash[hash].blockData;

export const isBlockLoading = (state: IRootState, hash: string): boolean => {
  const blockData = getBlockData(state, hash);
  return blockData && blockData.isLoading;
};
