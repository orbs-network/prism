import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ITx } from '../../shared/ITx';
import { loadTx } from '../utils/api-facade';

// Action Creators
export const loadTxAction = (txId: string): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(loadTxStartedAction(txId));
    try {
      const tx: ITx = await loadTx(txId); // Call the server api
      dispatch(loadTxCompletedAction(tx));
    } catch (e) {
      dispatch(loadTxErrorAction(txId, 'Tx Not Found'));
    }
  };
};

export interface ILoadingTxStartedAction {
  type: 'LOAD_TX_STARTED';
  txId: string;
}

export const loadTxStartedAction = (txId: string): ILoadingTxStartedAction => ({
  type: 'LOAD_TX_STARTED',
  txId,
});

export interface ILoadingTxCompletedAction {
  type: 'LOAD_TX_COMPLETED';
  tx: ITx;
}

export const loadTxCompletedAction = (tx: ITx): ILoadingTxCompletedAction => ({
  type: 'LOAD_TX_COMPLETED',
  tx,
});

export interface ILoadingTxErrorAction {
  type: 'LOAD_TX_ERROR';
  txId: string;
  error: string;
}

export const loadTxErrorAction = (txId: string, error: string): ILoadingTxErrorAction => ({
  type: 'LOAD_TX_ERROR',
  txId,
  error,
});

// All Actions
export type TxActions = ILoadingTxStartedAction | ILoadingTxCompletedAction | ILoadingTxErrorAction;
