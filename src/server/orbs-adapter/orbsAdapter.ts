import { Client, NetworkType } from 'orbs-client-sdk';
// import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { ORBS_ENDPOINT, ORBS_NETWORK_TYPE, ORBS_VIRTUAL_CHAIN_ID, POOLING_INTERVAL } from '../config';
import { INewBlocksHandler, IOrbsAdapter, IRawBlock } from './IOrbsAdapter';

export class OrbsAdapter implements IOrbsAdapter {
  private latestKnownHeight: bigint = BigInt(0);
  private orbsClient: Client;
  private listeners: Map<INewBlocksHandler, INewBlocksHandler> = new Map();

  public async init(): Promise<void> {
    this.orbsClient = new Client(ORBS_ENDPOINT, ORBS_VIRTUAL_CHAIN_ID, ORBS_NETWORK_TYPE as NetworkType);
    this.schedualNextRequest();
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
      const newHeight = getBlockResponse.blockHeight;
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

  private blockResponseToRawBlock(getBlockResponse): IRawBlock {
    return {
      blockHeight: getBlockResponse.resultsBlockHeader.blockHeight,
      blockHash: getBlockResponse.resultsBlockHash,
      timeStamp: getBlockResponse.blockTimestamp,
      transactions: getBlockResponse.transactions.map(tx => ({
        txId: tx.txId,
        data: 'Dummy_Data',
      })),
    };
  }

  private schedualNextRequest(): void {
    setTimeout(() => this.checkForNewBlocks(), POOLING_INTERVAL);
  }
}
