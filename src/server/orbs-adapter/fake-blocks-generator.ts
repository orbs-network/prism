/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { ExecutionResult, calcClientAddressOfEd25519PublicKey } from 'orbs-client-sdk';
import {
  BlockTransaction,
  GetBlockResponse,
  ResultsBlockHeader,
  TransactionsBlockHeader,
} from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { blockResponseToRawBlock } from '../block-transform/blockTransform';
import { IRawBlock } from '../../shared/IRawData';

export function generateRandomRawBlock(blockHeight: bigint): IRawBlock {
  const getBlockResponse: GetBlockResponse = generateRandomGetBlockRespose(blockHeight);
  return blockResponseToRawBlock(getBlockResponse);
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

function generateBlockTransaction(): BlockTransaction {
  const signerPublicKey = genUint8Array(50);
  return {
    txId: genUint8Array(40),
    txHash: genUint8Array(20),
    protocolVersion: 1,
    virtualChainId: 42,
    timestamp: new Date(),
    signerPublicKey,
    contractName: 'DummyContract',
    methodName: 'DummyMethod',
    inputArguments: [],
    executionResult: ExecutionResult.EXECUTION_RESULT_SUCCESS,
    outputArguments: [],
    outputEvents: [],
  };
}
