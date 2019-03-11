import { blockResponseToRawBlock } from '../block-transform/blockTransform';
import { IOrbsClient } from '../orbs-client/IOrbsClient';

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
  blockHash: string;
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

export type NewBlockCallback = (block: IRawBlock) => void;

export interface INewBlocksHandler {
  handleNewBlock(block: IRawBlock): Promise<void>;
}

export class OrbsAdapter {
  private latestKnownHeight: bigint = BigInt(0);
  private listeners: Map<INewBlocksHandler, INewBlocksHandler> = new Map();

  constructor(private orbsClient: IOrbsClient, private poolingInterval: number) {}
  public async init(): Promise<void> {
    this.initScheduler();
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

  public async getBlockAt(height: bigint): Promise<IRawBlock> {
    const getBlockResponse = await this.orbsClient.getBlock(height);
    return blockResponseToRawBlock(getBlockResponse);
  }

  private async checkForNewBlocks(): Promise<void> {
    try {
      const nextHeight = this.latestKnownHeight + 1n;
      console.log(`-------------------------- requesting block: `, nextHeight);
      const getBlockResponse = await this.orbsClient.getBlock(nextHeight);
      const blockHeight: bigint = BigInt(getBlockResponse.blockHeight);
      console.log(`-------------------------- response height: `, blockHeight);
      if (blockHeight > this.latestKnownHeight) {
        this.listeners.forEach(handler => handler.handleNewBlock(blockResponseToRawBlock(getBlockResponse)));
        this.latestKnownHeight = blockHeight;
      }
    } catch (e) {
      console.log(`-------------------------- error on checkForNewBlocks`, e);
    }
    this.schedualNextRequest();
  }

  private async initScheduler(): Promise<void> {
    if (this.latestKnownHeight === 0n) {
      console.log(`Asking Orbs for the lastest height`);
      this.latestKnownHeight = await this.queryOrbsForTheLatestHeight();
      console.log(`Lastest height is ${this.latestKnownHeight}`);
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

  private schedualNextRequest(): void {
    setTimeout(() => this.checkForNewBlocks(), this.poolingInterval);
  }
}
