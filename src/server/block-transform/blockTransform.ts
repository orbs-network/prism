import { IBlock } from '../../shared/IBlock';
import { IRawBlock } from '../orbs-adapter/IOrbsAdapter';

export function rawBlockToBlock(block: IRawBlock): IBlock {
  return {
    blockHash: block.blockHash,
    blockHeight: block.blockHeight,
    blockTimestamp: block.timeStamp,
    txIds: block.transactions.map(tx => tx.txId),
  };
}
