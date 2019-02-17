import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';
import { IRawBlock, IRawTx } from '../orbs-adapter/IOrbsAdapter';
import { hashToString } from '../hash-converter/hashConverter';

export function rawBlockToBlock(block: IRawBlock): IBlock {
  return {
    blockHash: hashToString(block.blockHash),
    blockHeight: block.blockHeight.toString(),
    blockTimestamp: block.timeStamp.getTime(),
    txsHashes: block.transactions.map(tx => hashToString(tx.txHash)),
  };
}

export function rawTxToTx(block: IRawBlock, tx: IRawTx): ITx {
  return {
    blockHash: hashToString(block.blockHash),
    txHash: hashToString(tx.txHash),
    data: tx.data,
  };
}
