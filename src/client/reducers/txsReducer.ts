import { ITx } from '../../shared/ITx';
import { RootAction } from '../actions/rootAction';
import { IRootState } from './rootReducer';

export interface ITxData {
  error?: string;
  tx?: ITx;
}

export interface ITxsByHash {
  [hash: string]: ITxData;
}

export function txsByHash(state: ITxsByHash = {}, action: RootAction): ITxsByHash {
  switch (action.type) {
    case 'LOAD_TX_COMPLETED':
      const { tx } = action;
      const { hash } = tx;
      return {
        ...state,
        [hash]: { tx },
      };
    default:
      return state;
  }
}

export const getTxData = (state: IRootState, hash: string): ITxData => state.txsByHash[hash];

export const isTxLoading = (state: IRootState, hash: string): boolean => state.txsByHash[hash] === undefined;
