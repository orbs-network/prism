import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { ITx } from '../../shared/ITx';
import { loadTx } from '../utils/api-facade';

// Action Creators
export const loadTxAction = (hash: string): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(loadTxStartedAction(hash));
    try {
      const tx: ITx = await loadTx(hash); // Call the server api
      dispatch(loadTxCompletedAction(tx));
    } catch (e) {
      dispatch(loadTxErrorAction(e));
    }
  };
};

export interface ILoadingTxStartedAction {
  type: 'LOAD_TX_STARTED';
  hash: string;
}

export const loadTxStartedAction = (hash: string): ILoadingTxStartedAction => ({
  type: 'LOAD_TX_STARTED',
  hash,
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
  error: string;
}

export const loadTxErrorAction = (error: string): ILoadingTxErrorAction => ({
  type: 'LOAD_TX_ERROR',
  error,
});

// All Actions
export type TxActions = ILoadingTxStartedAction | ILoadingTxCompletedAction | ILoadingTxErrorAction;
