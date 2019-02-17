import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';
import { IRawBlock, IRawTx } from '../orbs-adapter/IOrbsAdapter';
import { uint8ArrayToString } from '../hash-converter/hashConverter';

export function rawBlockToBlock(block: IRawBlock): IBlock {
  return {
    blockHash: uint8ArrayToString(block.blockHash),
    blockHeight: block.blockHeight.toString(),
    blockTimestamp: block.timeStamp.getTime(),
    txsHashes: block.transactions.map(tx => uint8ArrayToString(tx.txId)),
  };
}

export function rawTxToTx(block: IRawBlock, tx: IRawTx): ITx {
  return {
    blockHash: uint8ArrayToString(block.blockHash),
    txId: uint8ArrayToString(tx.txId),
    data: tx.data,
  };
}
