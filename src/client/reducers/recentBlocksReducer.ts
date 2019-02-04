import { IBlockSummary } from '../../shared/IBlock';
import { BlocksSummaryActions } from '../blocksSummaryActions';
import { IRootState } from './rootReducer';

export type RecentBlocksHashes = string[];

export function recentBlocksHashs(state: RecentBlocksHashes = [], action: BlocksSummaryActions): RecentBlocksHashes {
  switch (action.type) {
    case 'NEW_BLOCK_SUMMARY':
      const result = [...state, action.blockSummary.hash];
      return result.length > 5 ? result.splice(1, 5) : result;
    default:
      return state;
  }
}

export const getRecentBlocks = (state: IRootState) => state.recentBlocksHashs.map(hash => state.blocksByHash[hash]);
