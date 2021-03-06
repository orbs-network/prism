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
import { BlockTransaction, GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { IBlock, IBlockSummary } from '../../shared/IBlock';
import { ITxArgument, ITxEvent, ITx } from '../../shared/ITx';

export function blockToBlockSummary(block: IBlock): IBlockSummary {
  return {
    blockHash: block.blockHash,
    blockHeight: block.blockHeight,
    numTransactions: block.txIds.length,
    blockTimestamp: block.blockTimestamp,
    protocolVersion: block.protocolVersion,
  };
}

export function blockResponseToBlockSummary(getBlockResponse: GetBlockResponse): IBlockSummary {
  const blockHash = encodeHex(getBlockResponse.resultsBlockHash);
  const blockHeight = getBlockResponse.resultsBlockHeader.blockHeight.toString();
  return {
    blockHash,
    blockHeight,
    numTransactions: getBlockResponse.transactions.length,
    blockTimestamp: getBlockResponse.blockTimestamp.getTime(),
    protocolVersion: getBlockResponse.resultsBlockHeader.protocolVersion,
  };
}

export function blockResponseToBlock(getBlockResponse: GetBlockResponse): IBlock {
  const blockHash = encodeHex(getBlockResponse.resultsBlockHash);
  const blockHeight = getBlockResponse.resultsBlockHeader.blockHeight.toString();
  return {
    blockHeight,
    blockHash,
    blockTimestamp: getBlockResponse.blockTimestamp.getTime(),
    txIds: getBlockResponse.transactions.map(tx => encodeHex(tx.txId)),
    protocolVersion: getBlockResponse.resultsBlockHeader.protocolVersion,
  };
}

export function blockResponseTransactionsToTxs(block: GetBlockResponse): ITx[] {
  return block.transactions.map((tx, idx) => blockTransactionToTx(block.blockHeight.toString(), idx, tx));
}

export function blockResponseTransactionAsTx(block: GetBlockResponse, idxInBlock: number): ITx {
  return blockTransactionToTx(block.blockHeight.toString(), idxInBlock, block.transactions[idxInBlock]);
}

export function blockTransactionToTx(blockHeight: string, idxInBlock: number, tx: BlockTransaction): ITx {
  const isSystemTx = tx.contractName === '_Triggers' && tx.methodName === 'trigger';
  const SYSTEM_TRIGGER_PUBLIC_ADDRESS = '0x0000000000000000000000000000000000000000';
  const SYSTEM_TRIGGER_PUBLIC_KEY = 'System trigger';

  const signerPublicKey = isSystemTx ? SYSTEM_TRIGGER_PUBLIC_KEY : encodeHex(tx.signerPublicKey);
  const signerAddress = isSystemTx ? SYSTEM_TRIGGER_PUBLIC_ADDRESS : encodeHex(calcClientAddressOfEd25519PublicKey(tx.signerPublicKey));

  return {
    idxInBlock,
    txId: encodeHex(tx.txId),
    blockHeight,
    protocolVersion: tx.protocolVersion,
    virtualChainId: tx.virtualChainId,
    timestamp: tx.timestamp.getTime(),
    signerPublicKey,
    signerAddress,
    contractName: tx.contractName,
    methodName: tx.methodName,
    inputArguments: tx.inputArguments.map(convertToRawArgument),
    executionResult: tx.executionResult,
    outputArguments: tx.outputArguments.map(convertToRawArgument),
    outputEvents: tx.outputEvents.map(convertToRawEvent),
  }
}

function convertToRawArgument(argument: Argument): ITxArgument {
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

function convertToRawEvent(event: Event): ITxEvent {
  return {
    eventName: event.eventName,
    contractName: event.contractName,
    arguments: event.arguments.map(convertToRawArgument),
  };
}
