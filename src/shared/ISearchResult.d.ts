import { IBlock } from './IBlock';
import { ITx } from './ITx';

export interface IBlockResult {
  block: IBlock;
  type: 'block';
}

export interface ITxResult {
  tx: ITx;
  type: 'tx';
}

export type ISearchResult = IBlockResult | ITxResult;
