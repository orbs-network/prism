import { ITx } from '../../shared/ITx';

export interface IRawTx {
  txId: Uint8Array;
  data: string;
}

export interface IRawBlock {
  blockHeight: bigint;
  blockHash: Uint8Array;
  timeStamp: Date;
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
