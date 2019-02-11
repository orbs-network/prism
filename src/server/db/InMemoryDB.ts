import { IDB } from './IDB';
import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';

export class InMemoryDB implements IDB {
  private blocks: Map<string, IBlock> = new Map();
  private txs: Map<string, ITx> = new Map();

  public async storeBlock(block: IBlock): Promise<void> {
    this.blocks.set(block.hash, block);
  }

  public async getBlockByHash(hash: string): Promise<IBlock> {
    return this.blocks.get(hash);
  }

  public async storeTx(tx: ITx | ITx[]): Promise<void> {
    if (Array.isArray(tx)) {
      tx.map(t => this.txs.set(t.hash, t));
    } else {
      this.txs.set(tx.hash, tx);
    }
  }

  public async getTxByHash(hash: string): Promise<ITx> {
    return this.txs.get(hash);
  }
}
