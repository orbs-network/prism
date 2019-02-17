import { IDB } from './IDB';
import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';

export class InMemoryDB implements IDB {
  private blocks: Map<string, IBlock>;
  private txs: Map<string, ITx>;

  public async init(): Promise<void> {
    this.blocks = new Map();
    this.txs = new Map();
  }

  public async destroy(): Promise<void> {
    // nothing to destroy,,,
  }

  public async storeBlock(block: IBlock): Promise<void> {
    this.blocks.set(block.blockHash, block);
  }

  public async getBlockByHash(blockHash: string): Promise<IBlock> {
    return this.blocks.get(blockHash);
  }

  public async storeTx(tx: ITx | ITx[]): Promise<void> {
    if (Array.isArray(tx)) {
      tx.map(t => this.txs.set(t.txId, t));
    } else {
      this.txs.set(tx.txId, tx);
    }
  }

  public async getTxById(txId: string): Promise<ITx> {
    return this.txs.get(txId);
  }
}
