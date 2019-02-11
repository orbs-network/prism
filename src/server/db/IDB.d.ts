import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';

export interface IDB {
    init(): Promise<void>;
    storeBlock(block: IBlock): Promise<void>;
    getBlockByHash(hash: string): Promise<IBlock>;
    storeTx(tx: ITx | ITx[]): Promise<void>;
    getTxByHash(hash: string): Promise<ITx>;
}