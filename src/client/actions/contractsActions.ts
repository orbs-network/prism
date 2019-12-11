/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { loadAllContractsNames } from '../utils/api-facade';

// Action Creators
export const loadContractsNamesAction = (): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(loadContractsNamesStartedAction());
    try {
      const contractsNames: string[] = await loadAllContractsNames(); // Call the server api
      dispatch(loadContractsNamesCompletedAction(contractsNames));
    } catch (e) {
      dispatch(loadContractsNamesErrorAction('Unable to load contracts names'));
    }
  };
};

export interface ILoadingContractsNamesStartedAction {
  type: 'LOAD_CONTRACTS_NAMES_STARTED';
}

export const loadContractsNamesStartedAction = (): ILoadingContractsNamesStartedAction => ({
  type: 'LOAD_CONTRACTS_NAMES_STARTED'
});

export interface ILoadingContractsNamesCompletedAction {
  type: 'LOAD_CONTRACTS_NAMES_COMPLETED';
  contractsNames: string[];
}

export const loadContractsNamesCompletedAction = (contractsNames: string[]): ILoadingContractsNamesCompletedAction => ({
  type: 'LOAD_CONTRACTS_NAMES_COMPLETED',
  contractsNames,
});

export interface ILoadingContractsNamesErrorAction {
  type: 'LOAD_CONTRACTS_NAMES_ERROR';
  error: string;
}

export const loadContractsNamesErrorAction = (error: string): ILoadingContractsNamesErrorAction => ({
  type: 'LOAD_CONTRACTS_NAMES_ERROR',
  error,
});

// All Actions
export type ContractsActions = ILoadingContractsNamesStartedAction | ILoadingContractsNamesCompletedAction | ILoadingContractsNamesErrorAction;
