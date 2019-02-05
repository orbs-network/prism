import { BlocksSummaryActions } from './blocksSummaryActions';
import { BlocksActions } from './blockActions';
import { TxActions } from './txActions';

export type RootAction = BlocksSummaryActions | BlocksActions | TxActions;
