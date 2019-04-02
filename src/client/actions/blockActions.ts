/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { IBlock } from '../../shared/IBlock';
import { loadBlock } from '../utils/api-facade';

// Action Creators
export const loadBlockAction = (blockHeight: string): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(loadBlockStartedAction(blockHeight));
    try {
      const block: IBlock = await loadBlock(blockHeight); // Call the server api
      dispatch(loadBlockCompletedAction(block));
    } catch (e) {
      dispatch(loadBlockErrorAction(blockHeight, 'Block Not Found'));
    }
  };
};

export interface ILoadingBlockStartedAction {
  type: 'LOAD_BLOCK_STARTED';
  blockHeight: string;
}

export const loadBlockStartedAction = (blockHeight: string): ILoadingBlockStartedAction => ({
  type: 'LOAD_BLOCK_STARTED',
  blockHeight,
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
  blockHeight: string;
  error: string;
}

export const loadBlockErrorAction = (blockHeight: string, error: string): ILoadingBlockErrorAction => ({
  type: 'LOAD_BLOCK_ERROR',
  blockHeight,
  error,
});

// All Actions
export type BlocksActions = ILoadingBlockStartedAction | ILoadingBlockCompletedAction | ILoadingBlockErrorAction;
