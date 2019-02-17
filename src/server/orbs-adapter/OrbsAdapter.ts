import { Client, NetworkType } from 'orbs-client-sdk';
import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { INewBlocksHandler, IOrbsAdapter, IRawBlock } from './IOrbsAdapter';

export class OrbsAdapter implements IOrbsAdapter {
  private latestKnownHeight: bigint = BigInt(1);
  private orbsClient: Client;
  private listeners: Map<INewBlocksHandler, INewBlocksHandler> = new Map();

  public async init(): Promise<void> {
    this.orbsClient = new Client('http://localhost:9000', 42, NetworkType.NETWORK_TYPE_TEST_NET);
    this.startPooling();
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
    console.log(`calling getBlock at ${this.latestKnownHeight}`);
    const getBlockResponse: GetBlockResponse = await this.orbsClient.getBlock(this.latestKnownHeight);
    console.log(`done reading getBlockResponse:`, getBlockResponse);
    this.listeners.forEach(handler => handler.handleNewBlock(this.blockResponseToRawBlock(getBlockResponse)));
    this.latestKnownHeight++;
  }

  private blockResponseToRawBlock(getBlockResponse: GetBlockResponse): IRawBlock {
    return {
      blockHeight: getBlockResponse.resultsBlockHeader.blockHeight,
      blockHash: getBlockResponse.resultsBlockHash,
      timeStamp: getBlockResponse.blockTimestamp,
      transactions: getBlockResponse.transactions.map(tx => ({
        txHash: tx.txHash,
        data: 'Dummy_Data',
      })),
    };
  }

  private startPooling(): void {
    setInterval(() => this.checkForNewBlocks(), 1000);
  }
}
