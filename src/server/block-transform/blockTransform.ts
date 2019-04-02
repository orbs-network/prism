/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IBlock } from '../../shared/IBlock';
import { IRawBlock, IRawArgument, IRawEvent } from '../../shared/IRawData';
import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { uint8ArrayToHexString } from '../hash-converter/hashConverter';
import { Argument } from 'orbs-client-sdk/dist/codec/Arguments';
import { Event } from 'orbs-client-sdk/dist/codec/Events';

export function rawBlockToBlock(block: IRawBlock): IBlock {
  return {
    blockHash: block.blockHash,
    blockHeight: block.blockHeight,
    blockTimestamp: block.timeStamp,
    txIds: block.transactions.map(tx => tx.txId),
  };
}

export function blockResponseToRawBlock(getBlockResponse: GetBlockResponse): IRawBlock {
  const blockHash = uint8ArrayToHexString(getBlockResponse.resultsBlockHash);
  const blockHeight = getBlockResponse.resultsBlockHeader.blockHeight.toString();
  return {
    blockHeight,
    blockHash,
    timeStamp: getBlockResponse.blockTimestamp.getTime(),
    transactions: getBlockResponse.transactions.map(tx => ({
      txId: uint8ArrayToHexString(tx.txId),
      blockHeight,
      protocolVersion: tx.protocolVersion,
      virtualChainId: tx.virtualChainId,
      timestamp: tx.timestamp.getTime(),
      signerPublicKey: uint8ArrayToHexString(tx.signerPublicKey),
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
        value: uint8ArrayToHexString(argument.value),
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
