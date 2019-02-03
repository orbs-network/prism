import { IBlockSummary, IBlock } from '../shared/IBlock';
import { WS } from './ws/ws';

export class Storage {
  private ws: WS;
  private db: IBlock[] = [];

  public init(ws: WS): void {
    this.ws = ws;
  }

  public getBlock(blockHash: string): IBlock {
    return this.db.find(block => block.hash === blockHash);
  }

  public StoreBlock(block: IBlock): void {
    this.db.push(block);
    this.ws.emit('new-block-summary', this.blockToBlockSummary(block));
  }

  private blockToBlockSummary(block: IBlock): IBlockSummary {
    return {
      hash: block.hash,
      height: block.height,
      countOfTx: block.countOfTx,
      leanderNode: block.leanderNode,
      timestamp: block.timestamp,
    };
  }
}
