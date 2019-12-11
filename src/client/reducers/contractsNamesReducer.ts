/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { RootAction } from '../actions/rootAction';

export interface IContractsNames {
  isLoading: boolean;
  error: string;
  contractsNames: string[];
}

const INITIAL_STATE: IContractsNames = {
  isLoading: false,
  error: null,
  contractsNames: [],
};

export function contractsNames(state: IContractsNames = INITIAL_STATE, action: RootAction): IContractsNames {
  switch (action.type) {
    case 'LOAD_CONTRACTS_NAMES_COMPLETED': {
      const { contractsNames } = action;
      return { error: null, isLoading: false, contractsNames };
    }

    case 'LOAD_CONTRACTS_NAMES_STARTED': {
      return { error: null, isLoading: true, contractsNames: [] };
    }

    case 'LOAD_CONTRACTS_NAMES_ERROR': {
      const { error } = action;
      return { error, isLoading: false, contractsNames: [] };
    }
    default:
      return state;
  }
}
