/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IArgument } from './IArgument';
import { IOutputEvent } from './IOutputEvent';

export interface ITx {
  idxInBlock: number;
  contractExecutionIdx: number;
  txId: string;
  blockHeight: string;
  protocolVersion: number;
  virtualChainId: number;
  timestamp: number;
  signerPublicKey: string;
  signerAddress: string;
  contractName: string;
  methodName: string;
  inputArguments: IArgument[];
  executionResult: string;
  outputArguments: IArgument[];
  outputEvents: IOutputEvent[];
}
