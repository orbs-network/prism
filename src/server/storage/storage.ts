import { IBlock, IRawBlock } from '../../shared/IBlock';
import { ISearchResult } from '../../shared/ISearchResult';
import { ITx } from '../../shared/ITx';
import { IDB } from '../db/IDB';
import { rawBlockToBlock } from '../block-transform/blockTransform';

export class Storage {
  constructor(private db: IDB) {}

  public getBlock(blockHash: string): Promise<IBlock> {
    return this.db.getBlockByHash(blockHash);
  }

  public getTx(txHash: string): Promise<ITx> {
    return this.db.getTxByHash(txHash);
  }

  public async handleNewBlock(rawBlock: IRawBlock): Promise<void> {
    await this.db.storeBlock(rawBlockToBlock(rawBlock));
    await this.db.storeTx(rawBlock.txs);
  }

  public async findHash(hash: string): Promise<ISearchResult> {
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

    return null;
  }
}
