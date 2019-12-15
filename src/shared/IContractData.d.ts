export interface IShortTx {
  blockHeight: string;
  method: string;
  txId: string;
  signerAddress: string;
  successful: boolean
  executionIdx: number;
}

export interface IContractBlocksInfo {
  [blockHeight: string]: {
    stateDiff: any;
    txes: IShortTx[];
  };
}
export interface IContractData {
  contractName: string;
  code: string[];
  blocksInfo: IContractBlocksInfo;
}

export interface IContractGist {
  contractName: string;
  txId: string;
  deployedBy: string;
}
