/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { ITx } from '../../shared/ITx';
import { RootAction } from '../actions/rootAction';
import { IRootState } from './rootReducer';

export interface ITxData {
  error?: string;
  isLoading: boolean;
  tx?: ITx;
}

export interface ITxsById {
  [txId: string]: ITxData;
}
function appendTxToState(state: ITxsById, tx: ITx): ITxsById {
  const { txId } = tx;
  return {
    ...state,
    [txId.toLowerCase()]: {
      isLoading: false,
      tx,
    },
  };
}

export function txsById(state: ITxsById = {}, action: RootAction): ITxsById {
  switch (action.type) {
    case 'LOAD_TX_COMPLETED': {
      const { tx } = action;
      return appendTxToState(state, tx);
    }

    case 'LOAD_TX_ERROR': {
      const { error, txId } = action;
      return {
        ...state,
        [txId.toLowerCase()]: {
          isLoading: false,
          error,
        },
      };
    }

    case 'SEARCH_COMPLETED': {
      const { searchResult } = action;
      if (searchResult.type === 'tx') {
        return appendTxToState(state, searchResult.tx);
      } else {
        return state;
      }
    }

    default:
      return state;
  }
}

export const getTxData = (state: IRootState, txId: string): ITxData => state.txsById[txId.toLowerCase()];

export const isTxLoading = (state: IRootState, txId: string): boolean => {
  const tx = getTxData(state, txId);
  return tx && tx.isLoading;
};
