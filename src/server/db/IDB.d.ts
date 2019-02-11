import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';

export interface IDB {
    storeBlock(block: IBlock): Promise<void>;
    getBlockByHash(hash: string): Promise<IBlock>;
    storeTx(tx: ITx | ITx[]): Promise<void>;
    getTxByHash(hash: string): Promise<ITx>;
}