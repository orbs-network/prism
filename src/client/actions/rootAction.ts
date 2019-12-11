/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { BlocksSummaryActions } from './blocksSummaryActions';
import { BlocksActions } from './blockActions';
import { ContractsActions } from './contractsActions';
import { TxActions } from './txActions';
import { SearchActions } from './searchActions';
import { FocusedContractActions } from './focusedContractActions';

export type RootAction =
  | BlocksSummaryActions
  | BlocksActions
  | ContractsActions
  | TxActions
  | FocusedContractActions
  | SearchActions;
