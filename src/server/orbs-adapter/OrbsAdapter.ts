import { blockResponseToRawBlock } from '../block-transform/blockTransform';
import { IOrbsClient } from '../orbs-client/IOrbsClient';
import { IRawBlock } from '../../shared/IRawData';

export type NewBlockCallback = (block: IRawBlock) => void;

export interface INewBlocksHandler {
  handleNewBlock(block: IRawBlock): Promise<void>;
}

export class OrbsAdapter {
  private latestKnownHeight: bigint = BigInt(0);
  private listeners: Map<INewBlocksHandler, INewBlocksHandler> = new Map();
  private timeoutId: NodeJS.Timeout;

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
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
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
    if (!getBlockResponse) {
      console.log(`Orbs responded with no getBlockResponse. probably a connection issue with the orbs node.`);
      return 0n;
    }

    if (typeof getBlockResponse.blockHeight === 'bigint') {
      console.log(`Orbs responded blockHeight: ${getBlockResponse.blockHeight}`);
      return getBlockResponse.blockHeight;
    }

    console.log(`Orbs responded with no blockHeight. requestStatus: ${getBlockResponse.requestStatus}`);
    return 0n;
  }

  private schedualNextRequest(): void {
    this.timeoutId = setTimeout(() => this.checkForNewBlocks(), this.poolingInterval);
  }
}
