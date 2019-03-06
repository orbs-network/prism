import { IBlock } from '../../shared/IBlock';
import { ISearchResult } from '../../shared/ISearchResult';
import { ITx } from '../../shared/ITx';
import { rawBlockToBlock } from '../block-transform/blockTransform';
import { IDB } from '../db/IDB';
import { IRawBlock } from '../orbs-adapter/IOrbsAdapter';

export class Storage {
  constructor(private db: IDB) {}

  public getBlockByHash(blockHash: string): Promise<IBlock> {
    return this.db.getBlockByHash(blockHash);
  }

  public getBlockByHeight(blockHeight: string): Promise<IBlock> {
    return this.db.getBlockByHeight(blockHeight);
  }

  public getTx(txId: string): Promise<ITx> {
    return this.db.getTxById(txId);
  }

  public async handleNewBlock(rawBlock: IRawBlock): Promise<void> {
    await this.db.storeBlock(rawBlockToBlock(rawBlock));
    await this.db.storeTx(rawBlock.transactions);
  }

  public async search(term: string): Promise<ISearchResult> {
    let block = await this.getBlockByHeight(term);
    if (block) {
      return {
        block,
        type: 'block',
      };
    }

    block = await this.getBlockByHash(term);
    if (block) {
      return {
        block,
        type: 'block',
      };
    }

    const tx = await this.getTx(term);
    if (tx) {
      return {
        tx,
        type: 'tx',
      };
    }

    return null;
  }
}