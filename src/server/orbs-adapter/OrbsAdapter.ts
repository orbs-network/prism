import { Client, NetworkType } from 'orbs-client-sdk';
import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { ORBS_ENDPOINT, ORBS_NETWORK_TYPE, ORBS_VIRTUAL_CHAIN_ID, POOLING_INTERVAL } from '../config';
import { INewBlocksHandler, IOrbsAdapter, IRawBlock, IRawArgument, IRawEvent } from './IOrbsAdapter';
import { uint8ArrayToHexString } from '../hash-converter/hashConverter';
import { Argument } from 'orbs-client-sdk/dist/codec/Arguments';
import { Event } from 'orbs-client-sdk/dist/codec/Events';

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

export class OrbsAdapter implements IOrbsAdapter {
  private latestKnownHeight: bigint = BigInt(0);
  private orbsClient: Client;
  private listeners: Map<INewBlocksHandler, INewBlocksHandler> = new Map();

  public async init(): Promise<void> {
    this.orbsClient = new Client(ORBS_ENDPOINT, ORBS_VIRTUAL_CHAIN_ID, ORBS_NETWORK_TYPE as NetworkType);
    this.initSchedualer();
  }

  public RegisterToNewBlocks(handler: INewBlocksHandler): void {
    this.listeners.set(handler, handler);
  }

  public UnregisterFromNewBlocks(handler: INewBlocksHandler): void {
    this.listeners.delete(handler);
  }

  public dispose(): void {
    this.listeners = new Map();
  }

  public async getBlockAt(height: number): Promise<IRawBlock> {
    return null;
  }

  private async checkForNewBlocks(): Promise<void> {
    try {
      console.log(`-------------------------- requesting block: `, this.latestKnownHeight + BigInt(1));
      const getBlockResponse = await this.orbsClient.getBlock(this.latestKnownHeight + BigInt(1));
      const newHeight = getBlockResponse.resultsBlockHeader.blockHeight;
      console.log(`-------------------------- response height: `, newHeight);
      if (newHeight > this.latestKnownHeight) {
        this.listeners.forEach(handler => handler.handleNewBlock(this.blockResponseToRawBlock(getBlockResponse)));
        this.latestKnownHeight = newHeight;
      }
      this.schedualNextRequest();
    } catch (e) {
      console.log(`-------------------------- error on checkForNewBlocks`, e);
    }
  }

  private async initSchedualer(): Promise<void> {
    if (this.latestKnownHeight === 0n) {
      this.latestKnownHeight = await this.queryOrbsForTheLatestHeight();
    }
    this.schedualNextRequest();
  }

  private async queryOrbsForTheLatestHeight(): Promise<bigint> {
    const getBlockResponse = await this.orbsClient.getBlock(0n);
    if (typeof getBlockResponse.blockHeight === 'bigint') {
      return getBlockResponse.blockHeight;
    }

    return 0n;
  }

  private blockResponseToRawBlock(getBlockResponse: GetBlockResponse): IRawBlock {
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

  private schedualNextRequest(): void {
    setTimeout(() => this.checkForNewBlocks(), POOLING_INTERVAL);
  }
}
