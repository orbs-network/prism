import * as genHash from 'object-hash';
import { IRawBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';

let blockHeight = 1;
export function generateFakeTx(blockHash: string): ITx {
  return {
    blockHash,
    hash: genHash(Math.random()),
    data: Math.random().toString(),
  };
}

export function generateRandomFakeBlock(): IRawBlock {
  const hash: string = genHash(Math.random());
  const txs: ITx[] = [];
  const countOfTx = Math.floor(Math.random() * 10 + 6);
  for (let i = 0; i < countOfTx; i++) {
    txs.push(generateFakeTx(hash));
  }

  return {
    height: ++blockHeight,
    hash,
    countOfTx,
    leaderNode: 'mishmish',
    timestamp: Date.now(),
    txs,
  };
}
