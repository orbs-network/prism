import { ITx } from '../../shared/ITx';
import { BlockTransaction } from 'orbs-client-sdk/dist/codec/OpGetBlock';

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

export type NewBlockCallback = (block: IRawBlock) => void;

export interface INewBlocksHandler {
  handleNewBlock(block: IRawBlock): Promise<void>;
}

export interface IOrbsAdapter {
  init(): Promise<void>;
  RegisterToNewBlocks(handler: INewBlocksHandler): void;
  UnregisterFromNewBlocks(handler: INewBlocksHandler): void;
  getBlockAt(height: number): Promise<IRawBlock>;
  dispose(): void;
}
