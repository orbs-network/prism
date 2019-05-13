/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { IContractData } from '../../shared/IContractData';
import { loadContractData } from '../utils/api-facade';

// Action Creators
export const loadContractDataAction = (
  contractName: string,
  blockHeight?: string,
): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(loadContractDataStartedAction(contractName));
    try {
      const contractData: IContractData = await loadContractData(contractName, blockHeight); // Call the server api
      dispatch(loadContractDataCompletedAction(contractData));
    } catch (e) {
      dispatch(loadContractDataErrorAction(contractName, 'Contract Not Found'));
    }
  };
};

export interface ILoadingContractDataStartedAction {
  type: 'LOAD_CONTRACT_DATA_STARTED';
  contractName: string;
}

export const loadContractDataStartedAction = (contractName: string): ILoadingContractDataStartedAction => ({
  type: 'LOAD_CONTRACT_DATA_STARTED',
  contractName,
});

export interface ILoadingContractDataCompletedAction {
  type: 'LOAD_CONTRACT_DATA_COMPLETED';
  contractData: IContractData;
}

export const loadContractDataCompletedAction = (contractData: IContractData): ILoadingContractDataCompletedAction => ({
  type: 'LOAD_CONTRACT_DATA_COMPLETED',
  contractData,
});

export interface ILoadingContractDataErrorAction {
  type: 'LOAD_CONTRACT_DATA_ERROR';
  contractName: string;
  error: string;
}

export const loadContractDataErrorAction = (contractName: string, error: string): ILoadingContractDataErrorAction => ({
  type: 'LOAD_CONTRACT_DATA_ERROR',
  contractName,
  error,
});

// All Actions
export type FocusedContractActions =
  | ILoadingContractDataStartedAction
  | ILoadingContractDataCompletedAction
  | ILoadingContractDataErrorAction;
