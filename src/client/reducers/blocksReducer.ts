import { blocksSummaryActionsNames } from '../blocksSummaryActions';
import { IBlockSummary } from '../../shared/IBlock';

export type BlocksState = IBlockSummary[];
const initialSate: BlocksState = [];

export function blocks(state = initialSate, action) {
  switch (action.type) {
    case blocksSummaryActionsNames.NEW_BLOCK_SUMMARY:
      return [...state, action.blockSummary];
    default:
      return state;
  }
}
