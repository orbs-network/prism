import * as io from 'socket.io-client';
import { IBlockSummary } from '../shared/IBlock';

export const blocksSummaryActionsNames = {
  NEW_BLOCK_SUMMARY: 'NEW_BLOCK_SUMMARY',
};

const socket = io();

export function listenToBlocksSummaryAction() {
  return dispatch => {
    socket.on('new-block-summary', (blockSummary: IBlockSummary) => {
      dispatch(newBlockSummaryAction(blockSummary));
    });
  };
}

export function newBlockSummaryAction(blockSummary: IBlockSummary) {
  return {
    type: blocksSummaryActionsNames.NEW_BLOCK_SUMMARY,
    blockSummary,
  };
}
