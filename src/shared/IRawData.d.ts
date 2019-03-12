export interface IRawArgument {
  type: string;
  value: string;
}

export interface IRawEvent {
  contractName: string;
  eventName: string;
  arguments: IRawArgument[];
}

export interface IRawTx {
  txId: string;
  blockHash: string;
  protocolVersion: number;
  virtualChainId: number;
  timestamp: number;
  signerPublicKey: string;
  contractName: string;
  methodName: string;
  inputArguments: IRawArgument[];
  executionResult: string;
  outputArguments: IRawArgument[];
  outputEvents: IRawEvent[];
}

export interface IRawBlock {
  blockHeight: string;
  blockHash: string;
  timeStamp: number;
  transactions: IRawTx[];
}
