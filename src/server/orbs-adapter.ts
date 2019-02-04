import { IBlock } from '../shared/IBlock';
import { generateRandomFakeBlock } from './fake-blocks-generator';

export type NewBlockCallback = (block: IBlock) => void;

export class OrbsAdaper {
  private blocksGeneratorIntervalId: NodeJS.Timeout;
  private listenerCounter: number = 0;
  private listeners: Map<number, NewBlockCallback> = new Map();

  constructor() {
    this.generateBlocks();
  }

  public RegisterToNewBlocks(cb: NewBlockCallback): number {
    this.listenerCounter++;
    this.listeners.set(this.listenerCounter, cb);
    return this.listenerCounter;
  }

  public UnregisterFromNewBlocks(subscriptionToken: number) {
    this.listeners.delete(subscriptionToken);
  }

  public dispose(): void {
    if (this.blocksGeneratorIntervalId) {
      clearInterval(this.blocksGeneratorIntervalId);
    }
    this.listeners = new Map();
  }

  private emitNewBlock(): void {
    const newBlock = generateRandomFakeBlock();
    this.listeners.forEach(cb => cb(newBlock));
  }

  private generateBlocks() {
    this.blocksGeneratorIntervalId = setInterval(() => this.emitNewBlock(), 1500);
  }
}
