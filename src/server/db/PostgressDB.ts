import { IDB } from './IDB';
import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';

export class PostgressDB implements IDB {
  public storeTx(tx: ITx | ITx[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public getTxByHash(hash: string): Promise<ITx> {
    throw new Error('Method not implemented.');
  }
  public storeBlock(block: IBlock): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public getBlockByHash(hash: string): Promise<IBlock> {
    throw new Error('Method not implemented.');
  }
}
