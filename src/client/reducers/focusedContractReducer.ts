/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { RootAction } from '../actions/rootAction';
import { IContractData } from '../../shared/IContractData';

export interface IFocusedContract {
  isLoading: boolean;
  error: string;
  contractData: IContractData;
}

const initialState: IFocusedContract = {
  isLoading: false,
  error: null,
  contractData: null,
};

export function focusedContract(state: IFocusedContract = initialState, action: RootAction): IFocusedContract {
  switch (action.type) {
    case 'LOAD_CONTRACT_DATA_STARTED': {
      return {
        isLoading: true,
        error: null,
        contractData: null,
      };
    }

    case 'LOAD_CONTRACT_DATA_COMPLETED': {
      const { contractData } = action;
      return {
        isLoading: false,
        error: null,
        contractData,
      };
    }

    case 'LOAD_CONTRACT_DATA_ERROR': {
      const { error } = action;
      return {
        isLoading: false,
        error,
        contractData: null,
      };
    }

    default:
      return state;
  }
}
