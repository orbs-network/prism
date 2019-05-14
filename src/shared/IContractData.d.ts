export interface IShortTx {
  method: string;
  contractExecutionIdx: number;
  txId: string;
  signerAddress: string;
  successful: boolean;
}

export interface IContractBlockInfo {
  [blockHeight: string]: {
    stateDiff: any;
    txes: IShortTx[];
  };
}
export interface IContractData {
  contractName: string;
  code: string;
  blockInfo: IContractBlockInfo;
}
