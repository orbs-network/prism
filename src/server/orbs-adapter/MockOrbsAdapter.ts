import { generateRandomFakeBlock } from './fake-blocks-generator';
import { INewBlocksHandler, IOrbsAdapter, IRawBlock } from './IOrbsAdapter';

export class MockOrbsAdapter implements IOrbsAdapter {
  private blockChain: IRawBlock[] = [];
  private listeners: Map<INewBlocksHandler, INewBlocksHandler> = new Map();

  public async init(): Promise<void> {
    // nothing to do
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

  public getBlockAt(height: number): Promise<IRawBlock> {
    return new Promise((resolve, reject) => {
      if (height === 0 || height > this.blockChain.length) {
        reject(this.blockChain.length);
      } else {
        resolve(this.blockChain[height - 1]);
      }
    });
  }

  public emitNewBlock(forceBlockHeight?: number): void {
    const newBlock = generateRandomFakeBlock(forceBlockHeight);
    this.blockChain.push(newBlock);
    this.listeners.forEach(handler => handler.handleNewBlock(newBlock));
  }
}
