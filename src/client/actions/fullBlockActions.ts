import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import * as io from 'socket.io-client';
import { IBlock } from '../../shared/IBlock';
import { loadBlock } from '../utils/api-facade';
const socket = io();

// Action Creators
export const loadFullBlockAction = (hash: string): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(loadFullBlockStartedAction(hash));
    try {
      const block: IBlock = await loadBlock(hash); // Call the server api
      dispatch(loadFullBlockCompletedAction(block));
    } catch (e) {
      dispatch(loadFullBlockErrorAction(e));
    }
  };
};

export interface ILoadingFullBlockStartedAction {
  type: 'LOAD_FULL_BLOCK_STARTED';
  hash: string;
}

export const loadFullBlockStartedAction = (hash: string): ILoadingFullBlockStartedAction => ({
  type: 'LOAD_FULL_BLOCK_STARTED',
  hash,
});

export interface ILoadingFullBlockCompletedAction {
  type: 'LOAD_FULL_BLOCK_COMPLETED';
  block: IBlock;
}

export const loadFullBlockCompletedAction = (block: IBlock): ILoadingFullBlockCompletedAction => ({
  type: 'LOAD_FULL_BLOCK_COMPLETED',
  block,
});

export interface ILoadingFullBlockErrorAction {
  type: 'LOAD_FULL_BLOCK_ERROR';
  error: string;
}

export const loadFullBlockErrorAction = (error: string): ILoadingFullBlockErrorAction => ({
  type: 'LOAD_FULL_BLOCK_ERROR',
  error,
});

// All Actions
export type FullBlocksActions =
  | ILoadingFullBlockStartedAction
  | ILoadingFullBlockCompletedAction
  | ILoadingFullBlockErrorAction;
