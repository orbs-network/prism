import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { IBlock } from '../../shared/IBlock';
import { loadBlock } from '../utils/api-facade';

// Action Creators
export const loadBlockAction = (hash: string): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(loadBlockStartedAction(hash));
    try {
      const block: IBlock = await loadBlock(hash); // Call the server api
      dispatch(loadBlockCompletedAction(block));
    } catch (e) {
      dispatch(loadBlockErrorAction(hash, 'Block Not Found'));
    }
  };
};

export interface ILoadingBlockStartedAction {
  type: 'LOAD_BLOCK_STARTED';
  hash: string;
}

export const loadBlockStartedAction = (hash: string): ILoadingBlockStartedAction => ({
  type: 'LOAD_BLOCK_STARTED',
  hash,
});

export interface ILoadingBlockCompletedAction {
  type: 'LOAD_BLOCK_COMPLETED';
  block: IBlock;
}

export const loadBlockCompletedAction = (block: IBlock): ILoadingBlockCompletedAction => ({
  type: 'LOAD_BLOCK_COMPLETED',
  block,
});

export interface ILoadingBlockErrorAction {
  type: 'LOAD_BLOCK_ERROR';
  hash: string;
  error: string;
}

export const loadBlockErrorAction = (hash: string, error: string): ILoadingBlockErrorAction => ({
  type: 'LOAD_BLOCK_ERROR',
  hash,
  error,
});

// All Actions
export type BlocksActions = ILoadingBlockStartedAction | ILoadingBlockCompletedAction | ILoadingBlockErrorAction;
