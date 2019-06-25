import { IOrbsAdapter, INewBlocksHandler } from '../../orbs-adapter/IOrbsAdapter';
import { IRawBlock } from '../../../shared/IRawData';

export class OrbsAdapterMock implements IOrbsAdapter {
  private blockChain: IRawBlock[] = [];

  public async init(): Promise<void> {
    // nothing to do
  }

  public async initPooling(poolingInterval: number): Promise<void> {
    // nothing to do
  }

  public RegisterToNewBlocks(handler: INewBlocksHandler): void {
    // nothing to do
  }

  public UnregisterFromNewBlocks(handler: INewBlocksHandler): void {
    // nothing to do
  }

  public dispose(): void {
    // nothing to do
  }

  public async getBlockAt(height: bigint): Promise<IRawBlock> {
    return this.blockChain.find(b => BigInt(b.blockHeight) === height);
  }

  public async getLatestKnownHeight(): Promise<bigint> {
    return this.blockChain.map(block => BigInt(block.blockHeight)).reduce((prev, cur) => cur > prev ? cur : prev, 0n);
  }

  // helper functions
  public setBlockChain(blockChain: IRawBlock[]): void {
    this.blockChain = blockChain;
  }
}
