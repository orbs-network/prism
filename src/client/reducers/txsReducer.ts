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

export function txsById(state: ITxsById = {}, action: RootAction): ITxsById {
  switch (action.type) {
    case 'LOAD_TX_COMPLETED': {
      const { tx } = action;
      const { txId } = tx;
      return {
        ...state,
        [txId]: {
          isLoading: false,
          tx,
        },
      };
    }
    case 'LOAD_TX_ERROR': {
      const { error, txId } = action;
      return {
        ...state,
        [txId]: {
          isLoading: false,
          error,
        },
      };
    }
    default:
      return state;
  }
}

export const getTxData = (state: IRootState, txId: string): ITxData => state.txsById[txId];

export const isTxLoading = (state: IRootState, txId: string): boolean => {
  const tx = getTxData(state, txId);
  return tx && tx.isLoading;
};
