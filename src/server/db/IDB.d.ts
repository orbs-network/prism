import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';

export interface IDB {
  init(): Promise<void>;
  destroy(): Promise<void>;
  clearAll(): Promise<void>;
  storeBlock(block: IBlock): Promise<void>;
  getBlockByHash(blockHash: string): Promise<IBlock>;
  getBlockByHeight(blockHeight: string): Promise<IBlock>;
  storeTx(tx: ITx | ITx[]): Promise<void>;
  getTxById(txId: string): Promise<ITx>;
}
