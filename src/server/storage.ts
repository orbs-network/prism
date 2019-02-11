import { IBlockSummary, IRawBlock, IBlock } from '../shared/IBlock';
import { WS } from './ws/ws';
import { ITx } from '../shared/ITx';
import { ISearchResult } from '../shared/ISearchResult';
import { IDB } from './db/IDB';

export class Storage {
  private ws: WS;
  private db: IDB;

  public init(ws: WS, db: IDB): void {
    this.ws = ws;
    this.db = db;
  }

  public getBlock(blockHash: string): Promise<IBlock> {
    return this.db.getBlockByHash(blockHash);
  }

  public getTx(txHash: string): Promise<ITx> {
    return this.db.getTxByHash(txHash);
  }

  public async handleNewBlock(rawBlock: IRawBlock): Promise<void> {
    await this.db.storeBlock(this.rawBlockToBlock(rawBlock));
    await this.db.storeTx(rawBlock.txs);
    this.ws.emit('new-block-summary', this.blockToBlockSummary(rawBlock));
  }

  public async findHash(hash: string): Promise<ISearchResult> {
    console.log('searching for', hash);
    const block = await this.getBlock(hash);
    if (block) {
      return {
        block,
        type: 'block',
      };
    }

    const tx = await this.getTx(hash);
    if (tx) {
      return {
        tx,
        type: 'tx',
      };
    }
  }

  private rawBlockToBlock(block: IRawBlock): IBlock {
    return {
      hash: block.hash,
      height: block.height,
      countOfTx: block.countOfTx,
      timestamp: block.timestamp,
      txsHashes: block.txs.map(tx => tx.hash),
    };
  }

  private blockToBlockSummary(rawBlock: IRawBlock): IBlockSummary {
    return {
      hash: rawBlock.hash,
      height: rawBlock.height,
      countOfTx: rawBlock.countOfTx,
      timestamp: rawBlock.timestamp,
    };
  }
}
