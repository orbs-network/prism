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
  return {
    blockHeight: getBlockResponse.resultsBlockHeader.blockHeight.toString(),
    blockHash,
    timeStamp: getBlockResponse.blockTimestamp.getTime(),
    transactions: getBlockResponse.transactions.map(tx => ({
      txId: uint8ArrayToHexString(tx.txId),
      blockHash,
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
