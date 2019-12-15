/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { RootAction } from '../actions/rootAction';

export interface IDeployedContracts {
  isLoading: boolean;
  error: string;
  deployedContracts: string[];
}

const INITIAL_STATE: IDeployedContracts = {
  isLoading: false,
  error: null,
  deployedContracts: [],
};

export function deployedContracts(state: IDeployedContracts = INITIAL_STATE, action: RootAction): IDeployedContracts {
  switch (action.type) {
    case 'LOAD_DEPLOYED_CONTRACTS_COMPLETED': {
      const { deployedContracts } = action;
      return { error: null, isLoading: false, deployedContracts };
    }

    case 'LOAD_DEPLOYED_CONTRACTS_STARTED': {
      return { error: null, isLoading: true, deployedContracts: [] };
    }

    case 'LOAD_DEPLOYED_CONTRACTS_ERROR': {
      const { error } = action;
      return { error, isLoading: false, deployedContracts: [] };
    }
    default:
      return state;
  }
}
