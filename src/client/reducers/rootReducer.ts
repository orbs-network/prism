import { combineReducers, Reducer } from 'redux';
import { blocks, BlocksState } from './blocksReducer';

export interface IState {
  blocks: BlocksState;
}
export const rootReducer: Reducer<IState> = combineReducers<IState>({
  blocks,
});
