/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { argBytes, argString, argUint32, ExecutionResult } from 'orbs-client-sdk';
import { Argument } from 'orbs-client-sdk/dist/codec/Arguments';
import { BlockTransaction, GetBlockResponse, ResultsBlockHeader, TransactionsBlockHeader } from 'orbs-client-sdk/dist/codec/OpGetBlock';

export function generateBlockResponseWithTransaction(
  blockHeight: bigint,
  txes: BlockTransaction | BlockTransaction[],
): GetBlockResponse {
  const getBlockResponse: GetBlockResponse = generateRandomGetBlockRespose(blockHeight);
  getBlockResponse.transactions = Array.isArray(txes) ? txes : [txes];
  return getBlockResponse;
}

export function generateOverflowGetBlockRespose(blockHeight: bigint): GetBlockResponse {
  return {
    requestStatus: 'BAD_REQUEST' as any,
    blockHeight,
    blockTimestamp: new Date(),
    transactionsBlockHash: new Uint8Array(0),
    transactionsBlockHeader: null,
    resultsBlockHash: new Uint8Array(0),
    resultsBlockHeader: null,
    transactions: [],
  };
}

export function generateRandomGetBlockRespose(blockHeight: bigint): GetBlockResponse {
  const numTransactions = Math.floor(Math.random() * 10 + 6);
  const protocolVersion = 1;
  const virtualChainId = 42;
  const now = new Date();
  const prevBlockHash = genUint8Array(20);
  const transactionsBlockHash = genUint8Array(20);

  const transactionsBlockHeader: TransactionsBlockHeader = {
    protocolVersion,
    virtualChainId,
    blockHeight,
    prevBlockHash: genUint8Array(20),
    timestamp: now,
    numTransactions,
  };

  const resultsBlockHeader: ResultsBlockHeader = {
    protocolVersion,
    virtualChainId,
    blockHeight,
    prevBlockHash,
    timestamp: now,
    transactionsBlockHash,
    numTransactionReceipts: 1,
  };

  const transactions: BlockTransaction[] = [];
  for (let i = 0; i < numTransactions; i++) {
    transactions.push(generateBlockTransaction());
  }

  return {
    requestStatus: 'COMPLETED' as any,
    blockHeight,
    blockTimestamp: now,
    transactionsBlockHash,
    transactionsBlockHeader,
    resultsBlockHash: genUint8Array(20),
    resultsBlockHeader,
    transactions,
  };
}

function genUint8Array(len: number): Uint8Array {
  const result = new Uint8Array(len);
  for (let i: number = 0; i < len; i++) {
    result[i] = Math.floor(Math.random() * 255);
  }
  return result;
}

export function generateBlockTransaction(
  contractName: string = 'DummyContract',
  methodName: string = 'DummyMethod',
  inputArguments: Argument[] = [],
): BlockTransaction {
  return {
    txId: genUint8Array(40),
    txHash: genUint8Array(20),
    protocolVersion: 1,
    virtualChainId: 42,
    timestamp: new Date(),
    signerPublicKey: genUint8Array(32),
    contractName,
    methodName,
    inputArguments,
    executionResult: ExecutionResult.EXECUTION_RESULT_SUCCESS,
    outputArguments: [],
    outputEvents: [],
  };
}

export function generateContractDeployTransaction(contractName: string, ...codeArray: string[]): BlockTransaction {
  const codesAsArgs = codeArray.map(code => argBytes(Uint8Array.from(Buffer.from(code))));
  const inputArguments = [argString(contractName), argUint32(1), ...codesAsArgs];

  return generateBlockTransaction('_Deployments', 'deployService', inputArguments);
}
