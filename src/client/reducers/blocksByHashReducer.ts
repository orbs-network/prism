import { IBlockSummary } from '../../shared/IBlock';
import { BlocksSummaryActions } from '../blocksSummaryActions';

export interface IBlocksByHash {
  [hash: string]: IBlockSummary;
}

export function blocksByHash(state: IBlocksByHash = {}, action: BlocksSummaryActions): IBlocksByHash {
  switch (action.type) {
    case 'NEW_BLOCK_SUMMARY':
      return {
        ...state,
        [action.blockSummary.hash]: action.blockSummary,
      };
    default:
      return state;
  }
}
