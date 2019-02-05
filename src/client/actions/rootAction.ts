import { BlocksSummaryActions } from './blocksSummaryActions';
import { FullBlocksActions } from './fullBlockActions';
import { TxActions } from './txActions';

export type RootAction = BlocksSummaryActions | FullBlocksActions | TxActions;
