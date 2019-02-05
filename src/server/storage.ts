import { IBlockSummary, IRawBlock, IBlock } from '../shared/IBlock';
import { WS } from './ws/ws';
import { ITx } from '../shared/ITx';

export class Storage {
  private ws: WS;
  private blocks: Map<string, IBlock> = new Map();
  private txs: Map<string, ITx> = new Map();

  public init(ws: WS): void {
    this.ws = ws;
  }

  public getBlock(blockHash: string): IBlock {
    return this.blocks.get(blockHash);
  }

  public getTx(txHash: string): ITx {
    return this.txs.get(txHash);
  }

  public StoreBlock(rawBlock: IRawBlock): void {
    this.blocks.set(rawBlock.hash, this.rawBlockToBlock(rawBlock));
    rawBlock.txs.map(tx => this.txs.set(tx.hash, tx));
    this.ws.emit('new-block-summary', this.blockToBlockSummary(rawBlock));
  }

  private rawBlockToBlock(block: IRawBlock): IBlock {
    return {
      hash: block.hash,
      height: block.height,
      countOfTx: block.countOfTx,
      leanderNode: block.leanderNode,
      timestamp: block.timestamp,
      txsHashes: block.txs.map(tx => tx.hash),
    };
  }

  private blockToBlockSummary(rawBlock: IRawBlock): IBlockSummary {
    return {
      hash: rawBlock.hash,
      height: rawBlock.height,
      countOfTx: rawBlock.countOfTx,
      leanderNode: rawBlock.leanderNode,
      timestamp: rawBlock.timestamp,
    };
  }
}
