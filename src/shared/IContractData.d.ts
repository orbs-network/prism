export interface IContractBlockInfo {
  [blockHeight: string]: {
    stateDiff: any;
    txes: string[];
  };
}
export interface IContractData {
  contractName: string;
  code: string;
  blockInfo: IContractBlockInfo;
}
