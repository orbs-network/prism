import { BlocksSummaryActions } from './blocksSummaryActions';
import { BlocksActions } from './blockActions';
import { TxActions } from './txActions';
import { SearchActions } from './searchActions';

export type RootAction = BlocksSummaryActions | BlocksActions | TxActions | SearchActions;
