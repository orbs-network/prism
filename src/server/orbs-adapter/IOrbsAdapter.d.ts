import { number } from 'prop-types';
import { IRawBlock } from '../../shared/IBlock';

export type NewBlockCallback = (block: IRawBlock) => void;

export interface IOrbsAdapter {
  RegisterToNewBlocks(cb: NewBlockCallback): number;
  UnregisterFromNewBlocks(subscriptionToken: number): void;
  dispose(): void;
}
