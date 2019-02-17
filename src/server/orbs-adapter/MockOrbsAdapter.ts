import { generateRandomFakeBlock } from './fake-blocks-generator';
import { INewBlocksHandler, IOrbsAdapter, IRawBlock } from './IOrbsAdapter';

export class MockOrbsAdapter implements IOrbsAdapter {
  private blockChain: IRawBlock[] = [];
  private blocksGeneratorIntervalId: NodeJS.Timeout;
  private listeners: Map<INewBlocksHandler, INewBlocksHandler> = new Map();

  public async init(): Promise<void> {
    this.generateBlocks();
  }

  public RegisterToNewBlocks(handler: INewBlocksHandler): void {
    this.listeners.set(handler, handler);
  }

  public UnregisterFromNewBlocks(handler: INewBlocksHandler): void {
    this.listeners.delete(handler);
  }

  public dispose(): void {
    if (this.blocksGeneratorIntervalId) {
      clearInterval(this.blocksGeneratorIntervalId);
    }
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

  private emitNewBlock(): void {
    const newBlock = generateRandomFakeBlock();
    this.blockChain.push(newBlock);
    this.listeners.forEach(handler => handler.handleNewBlock(newBlock));
  }

  private generateBlocks() {
    this.blocksGeneratorIntervalId = setInterval(() => this.emitNewBlock(), 1500);
  }
}
