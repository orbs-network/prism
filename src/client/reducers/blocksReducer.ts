import { IBlockSummary, IBlock } from '../../shared/IBlock';
import { RootAction } from '../actions/rootAction';
import { IRootState } from './rootReducer';

export interface IBlockData {
  error?: string;
  block?: IBlock;
}

export interface IBlockData {
  summary?: IBlockSummary;
  blockData?: IBlockData;
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
    case 'LOAD_BLOCK_COMPLETED':
      const { block } = action;
      const { hash } = block;
      const summary = state[hash] && state[hash].summary;
      return {
        ...state,
        [hash]: {
          summary,
          blockData: {
            block,
          },
        },
      };
    default:
      return state;
  }
}

export const getBlockData = (state: IRootState, hash: string): IBlockData =>
  state.blocksByHash[hash] && state.blocksByHash[hash].blockData;

export const isBlockLoading = (state: IRootState, hash: string): boolean =>
  state.blocksByHash[hash] === undefined || state.blocksByHash[hash].blockData === undefined;
