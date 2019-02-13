import { number } from 'prop-types';
import { IRawBlock, IBlock } from '../../shared/IBlock';

export type NewBlockCallback = (block: IRawBlock) => void;

export interface INewBlocksHandler {
  handleNewBlock(block: IRawBlock): Promise<void>;
}
export interface IOrbsAdapter {
  RegisterToNewBlocks(handler: INewBlocksHandler): void;
  UnregisterFromNewBlocks(handler: INewBlocksHandler): void;
  getBlockAt(height: number): Promise<IRawBlock>;
  dispose(): void;
}
