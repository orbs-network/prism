import { IBlockSummary } from '../../shared/IBlock';
import { RootAction } from '../actions/rootAction';

export interface IBlockSummaryByHash {
  [blockHash: string]: IBlockSummary;
}

export function blocksSummaryByHash(state: IBlockSummaryByHash = {}, action: RootAction): IBlockSummaryByHash {
  switch (action.type) {
    case 'NEW_BLOCK_SUMMARY': {
      const { blockSummary } = action;
      const { blockHash } = blockSummary;
      return {
        ...state,
        [blockHash]: blockSummary,
      };
    }

    default:
      return state;
  }
}
