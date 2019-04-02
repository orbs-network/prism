/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

export interface IRawArgument {
  type: string;
  value: string;
}

export interface IRawEvent {
  contractName: string;
  eventName: string;
  arguments: IRawArgument[];
}

export interface IRawTx {
  txId: string;
  blockHeight: string;
  protocolVersion: number;
  virtualChainId: number;
  timestamp: number;
  signerPublicKey: string;
  contractName: string;
  methodName: string;
  inputArguments: IRawArgument[];
  executionResult: string;
  outputArguments: IRawArgument[];
  outputEvents: IRawEvent[];
}

export interface IRawBlock {
  blockHeight: string;
  blockHash: string;
  timeStamp: number;
  transactions: IRawTx[];
}
