import { IBlock, IRawBlock } from '../../shared/IBlock';

export function rawBlockToBlock(block: IRawBlock): IBlock {
  return {
    hash: block.hash,
    height: block.height,
    countOfTx: block.countOfTx,
    timestamp: block.timestamp,
    txsHashes: block.txs.map(tx => tx.hash),
  };
}
