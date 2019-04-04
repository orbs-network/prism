/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import * as io from 'socket.io-client';
import { IBlockSummary } from '../../shared/IBlock';
import { getLatestBlocksSummary } from '../utils/api-facade';

const socket = io();

export const loadLatestBlocksSummaryAction = (): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    const blocksSummary = await getLatestBlocksSummary(5);
    dispatch(latestBlocksSummaryAction(blocksSummary));
    dispatch(listenToBlocksSummaryAction());
  };
};

export const listenToBlocksSummaryAction = (): ThunkAction<void, {}, {}, AnyAction> => {
  return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    socket.on('new-block-summary', (blockSummary: IBlockSummary) => {
      dispatch(newBlockSummaryAction(blockSummary));
    });
  };
};

export interface INewBlockSummaryAction {
  type: 'NEW_BLOCK_SUMMARY';
  blockSummary: IBlockSummary;
}

export const newBlockSummaryAction = (blockSummary: IBlockSummary): INewBlockSummaryAction => ({
  type: 'NEW_BLOCK_SUMMARY',
  blockSummary,
});

export interface ILatestBlocksSummaryAction {
  type: 'LATEST_BLOCKS_SUMMARY';
  blocksSummary: IBlockSummary[];
}

export const latestBlocksSummaryAction = (blocksSummary: IBlockSummary[]): ILatestBlocksSummaryAction => ({
  type: 'LATEST_BLOCKS_SUMMARY',
  blocksSummary,
});

// All Actions
export type BlocksSummaryActions = INewBlockSummaryAction | ILatestBlocksSummaryAction;
