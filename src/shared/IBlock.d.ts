export interface IBlockSummary {
  hash: string;
  height: number;
  countOfTx: number;
  leanderNode: string;
  timestamp: number;
}

export interface ITransaction {
  hash: string;
}

export interface IBlock extends IBlockSummary {
  txs: ITransaction[];
}
