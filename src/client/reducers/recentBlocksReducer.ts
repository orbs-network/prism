import { IBlockSummary } from '../../shared/IBlock';
import { BlocksSummaryActions } from '../actions/blocksSummaryActions';
import { IRootState } from './rootReducer';

export type RecentBlocksHashes = string[];

export function recentBlocksHashs(state: RecentBlocksHashes = [], action: BlocksSummaryActions): RecentBlocksHashes {
  switch (action.type) {
    case 'NEW_BLOCK_SUMMARY':
      const result = [...state, action.blockSummary.blockHash];
      return result.length > 5 ? result.splice(1, 5) : result;
    default:
      return state;
  }
}

export const getRecentBlocksSummary = (state: IRootState): IBlockSummary[] =>
  state.recentBlocksHashs.map(hash => state.blocksByHash[hash].summary);
