import { ITx } from '../../shared/ITx';
import { RootAction } from '../actions/rootAction';
import { IRootState } from './rootReducer';

export interface ITxData {
  error?: string;
  isLoading: boolean;
  tx?: ITx;
}

export interface ITxsByHash {
  [hash: string]: ITxData;
}

export function txsByHash(state: ITxsByHash = {}, action: RootAction): ITxsByHash {
  switch (action.type) {
    case 'LOAD_TX_COMPLETED': {
      const { tx } = action;
      const { txHash } = tx;
      return {
        ...state,
        [txHash]: {
          isLoading: false,
          tx,
        },
      };
    }
    case 'LOAD_TX_ERROR': {
      const { error, hash } = action;
      return {
        ...state,
        [hash]: {
          isLoading: false,
          error,
        },
      };
    }
    default:
      return state;
  }
}

export const getTxData = (state: IRootState, hash: string): ITxData => state.txsByHash[hash];

export const isTxLoading = (state: IRootState, hash: string): boolean => {
  const tx = getTxData(state, hash);
  return tx && tx.isLoading;
};
