import { IBlockSummary } from '../../shared/IBlock';
import { BlocksSummaryActions } from '../blocksSummaryActions';

export type BlocksState = IBlockSummary[];
const initialSate: BlocksState = [];

export function blocks(state = initialSate, action: BlocksSummaryActions) {
  switch (action.type) {
    case 'NEW_BLOCK_SUMMARY':
      return [...state, action.blockSummary];
    default:
      return state;
  }
}
