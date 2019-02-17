import { ITx } from './ITx';

export interface IBlockHeader {
  blockHash: string;
  blockHeight: string;
  blockTimestamp: number;
}

export interface IBlockSummary extends IBlockHeader {
  numTransactions: number;
}

export interface IBlock extends IBlockHeader {
  txsHashes: string[];
}
