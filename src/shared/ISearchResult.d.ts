import { IBlock } from './IBlock';
import { IRawTx } from './IRawData';

export interface IBlockResult {
  block: IBlock;
  type: 'block';
}

export interface ITxResult {
  tx: IRawTx;
  type: 'tx';
}

export type ISearchResult = IBlockResult | ITxResult;
