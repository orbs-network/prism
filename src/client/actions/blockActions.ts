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
export const loadBlockAction = (blockHash: string): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(loadBlockStartedAction(blockHash));
    try {
      const block: IBlock = await loadBlock(blockHash); // Call the server api
      dispatch(loadBlockCompletedAction(block));
    } catch (e) {
      dispatch(loadBlockErrorAction(blockHash, 'Block Not Found'));
    }
  };
};

export interface ILoadingBlockStartedAction {
  type: 'LOAD_BLOCK_STARTED';
  blockHash: string;
}

export const loadBlockStartedAction = (blockHash: string): ILoadingBlockStartedAction => ({
  type: 'LOAD_BLOCK_STARTED',
  blockHash,
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
  blockHash: string;
  error: string;
}

export const loadBlockErrorAction = (blockHash: string, error: string): ILoadingBlockErrorAction => ({
  type: 'LOAD_BLOCK_ERROR',
  blockHash,
  error,
});

// All Actions
export type BlocksActions = ILoadingBlockStartedAction | ILoadingBlockCompletedAction | ILoadingBlockErrorAction;
