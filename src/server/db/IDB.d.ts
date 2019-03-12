import { IBlock } from '../../shared/IBlock';
import { IRawTx } from '../../shared/IRawData';

export interface IDB {
  init(): Promise<void>;
  destroy(): Promise<void>;
  clearAll(): Promise<void>;
  storeBlock(block: IBlock): Promise<void>;
  getBlockByHash(blockHash: string): Promise<IBlock>;
  getBlockByHeight(blockHeight: string): Promise<IBlock>;
  getLatestBlockHeight(): Promise<bigint>;
  storeTx(tx: IRawTx | IRawTx[]): Promise<void>;
  getTxById(txId: string): Promise<IRawTx>;
}
