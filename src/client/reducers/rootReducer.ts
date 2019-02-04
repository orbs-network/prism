import { combineReducers, Reducer } from 'redux';
import { blocks, BlocksState } from './blocksReducer';

export interface IRootState {
  blocks: BlocksState;
}
export const rootReducer: Reducer<IRootState> = combineReducers<IRootState>({
  blocks,
});
