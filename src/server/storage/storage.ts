import { IBlock } from '../../shared/IBlock';
import { ISearchResult } from '../../shared/ISearchResult';
import { ITx } from '../../shared/ITx';
import { rawBlockToBlock, rawTxToTx } from '../block-transform/blockTransform';
import { IDB } from '../db/IDB';
import { IRawBlock } from '../orbs-adapter/IOrbsAdapter';

export class Storage {
  constructor(private db: IDB) {}

  public getBlock(blockHash: string): Promise<IBlock> {
    return this.db.getBlockByHash(blockHash);
  }

  public getTx(txId: string): Promise<ITx> {
    return this.db.getTxById(txId);
  }

  public async handleNewBlock(rawBlock: IRawBlock): Promise<void> {
    await this.db.storeBlock(rawBlockToBlock(rawBlock));
    await this.db.storeTx(rawBlock.transactions.map(tx => rawTxToTx(rawBlock, tx)));
  }

  public async search(term: string): Promise<ISearchResult> {
    const block = await this.getBlock(term);
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
