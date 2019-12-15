/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { loadAllDeployedContracts } from '../utils/api-facade';
import { IContractGist } from '../../shared/IContractData';

// Action Creators
export const loadDeployedContractsAction = (): ThunkAction<void, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    dispatch(loadDeployedContractsStartedAction());
    try {
      const deployedContracts: IContractGist[] = await loadAllDeployedContracts(); // Call the server api
      dispatch(loadDeployedContractsGistCompletedAction(deployedContracts));
    } catch (e) {
      dispatch(loadDeployedContractsGistErrorAction('Unable to load deployed contracts'));
    }
  };
};

export interface ILoadingDeployedContractsStartedAction {
  type: 'LOAD_DEPLOYED_CONTRACTS_STARTED';
}

export const loadDeployedContractsStartedAction = (): ILoadingDeployedContractsStartedAction => ({
  type: 'LOAD_DEPLOYED_CONTRACTS_STARTED'
});

export interface ILoadingDeployedContractsGistCompletedAction {
  type: 'LOAD_DEPLOYED_CONTRACTS_COMPLETED';
  deployedContracts: IContractGist[];
}

export const loadDeployedContractsGistCompletedAction = (deployedContracts: IContractGist[]): ILoadingDeployedContractsGistCompletedAction => ({
  type: 'LOAD_DEPLOYED_CONTRACTS_COMPLETED',
  deployedContracts,
});

export interface ILoadingDeployedContractsGistErrorAction {
  type: 'LOAD_DEPLOYED_CONTRACTS_ERROR';
  error: string;
}

export const loadDeployedContractsGistErrorAction = (error: string): ILoadingDeployedContractsGistErrorAction => ({
  type: 'LOAD_DEPLOYED_CONTRACTS_ERROR',
  error,
});

// All Actions
export type DeployedContractsActions = ILoadingDeployedContractsStartedAction | ILoadingDeployedContractsGistCompletedAction | ILoadingDeployedContractsGistErrorAction;
