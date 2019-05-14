/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { calcClientAddressOfEd25519PublicKey, encodeHex } from 'orbs-client-sdk';
import { Argument } from 'orbs-client-sdk/dist/codec/Arguments';
import { Event } from 'orbs-client-sdk/dist/codec/Events';
import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { IBlock, IBlockSummary } from '../../shared/IBlock';
import { IRawArgument, IRawBlock, IRawEvent, IRawTx } from '../orbs-adapter/IRawData';
import { ITx } from '../../shared/ITx';

export function blockToBlockSummary(block: IBlock): IBlockSummary {
  return {
    blockHash: block.blockHash,
    blockHeight: block.blockHeight,
    numTransactions: block.txIds.length,
    blockTimestamp: block.blockTimestamp,
  };
}

export function rawBlockToBlockSummary(rawBlock: IRawBlock): IBlockSummary {
  return {
    blockHash: rawBlock.blockHash,
    blockHeight: rawBlock.blockHeight,
    numTransactions: rawBlock.transactions.length,
    blockTimestamp: rawBlock.timeStamp,
  };
}

export function rawBlockToBlock(block: IRawBlock): IBlock {
  return {
    blockHash: block.blockHash,
    blockHeight: block.blockHeight,
    blockTimestamp: block.timeStamp,
    txIds: block.transactions.map(tx => tx.txId),
  };
}

export function rawTxToTx(rawTx: IRawTx, contractExecutionIdx: number): ITx {
  return {
    contractExecutionIdx,
    ...rawTx,
  };
}

export function blockResponseToRawBlock(getBlockResponse: GetBlockResponse): IRawBlock {
  const blockHash = encodeHex(getBlockResponse.resultsBlockHash);
  const blockHeight = getBlockResponse.resultsBlockHeader.blockHeight.toString();
  return {
    blockHeight,
    blockHash,
    timeStamp: getBlockResponse.blockTimestamp.getTime(),
    transactions: getBlockResponse.transactions.map(tx => ({
      txId: encodeHex(tx.txId),
      blockHeight,
      protocolVersion: tx.protocolVersion,
      virtualChainId: tx.virtualChainId,
      timestamp: tx.timestamp.getTime(),
      signerPublicKey: encodeHex(tx.signerPublicKey),
      signerAddress: encodeHex(calcClientAddressOfEd25519PublicKey(tx.signerPublicKey)),
      contractName: tx.contractName,
      methodName: tx.methodName,
      inputArguments: tx.inputArguments.map(convertToRawArgument),
      executionResult: tx.executionResult,
      outputArguments: tx.outputArguments.map(convertToRawArgument),
      outputEvents: tx.outputEvents.map(convertToRawEvent),
    })),
  };
}

function convertToRawArgument(argument: Argument): IRawArgument {
  switch (argument.type) {
    case 'uint64':
    case 'uint32':
      return {
        type: argument.type,
        value: argument.value.toString(),
      };

    case 'string':
      return {
        type: argument.type,
        value: argument.value,
      };

    case 'bytes':
      return {
        type: argument.type,
        value: encodeHex(argument.value),
      };

    default:
      break;
  }
}

function convertToRawEvent(event: Event): IRawEvent {
  return {
    eventName: event.eventName,
    contractName: event.contractName,
    arguments: event.arguments.map(convertToRawArgument),
  };
}
