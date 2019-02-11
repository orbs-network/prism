import { ITx } from './ITx';

export interface IBlockSummary {
  hash: string;
  height: number;
  countOfTx: number;
  leaderNode: string;
  timestamp: number;
}

export interface IBlock extends IBlockSummary {
  txsHashes: string[];
}

export interface IRawBlock extends IBlockSummary {
  txs: ITx[];
}
