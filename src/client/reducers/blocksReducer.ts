import { IBlockSummary, IBlock } from '../../shared/IBlock';
import { RootAction } from '../actions/rootAction';
import { IRootState } from './rootReducer';

export interface IFullBlockData {
  error?: string;
  block?: IBlock;
}

export interface IBlockData {
  summary?: IBlockSummary;
  fullBlockData?: IFullBlockData;
}

export interface IBlocksByHash {
  [hash: string]: IBlockData;
}

export function blocksByHash(state: IBlocksByHash = {}, action: RootAction): IBlocksByHash {
  switch (action.type) {
    case 'NEW_BLOCK_SUMMARY':
      return {
        ...state,
        [action.blockSummary.hash]: {
          summary: action.blockSummary,
        },
      };
    case 'LOAD_FULL_BLOCK_COMPLETED':
      const { block } = action;
      const { hash } = block;
      const summary = state[hash] && state[hash].summary;
      return {
        ...state,
        [hash]: {
          summary,
          fullBlockData: {
            block,
          },
        },
      };
    default:
      return state;
  }
}

export const getFullBlockData = (state: IRootState, hash: string): IFullBlockData =>
  state.blocksByHash[hash] && state.blocksByHash[hash].fullBlockData;

export const isFullBlockLoading = (state: IRootState, hash: string): boolean =>
  state.blocksByHash[hash] === undefined || state.blocksByHash[hash].fullBlockData === undefined;
