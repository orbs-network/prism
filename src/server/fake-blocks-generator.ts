import * as hash from 'object-hash';
import { IBlock, ITransaction } from '../shared/IBlock';

let blockHeight = 1;
export function generateFakeTx(): ITransaction {
  return {
    hash: hash(Math.random()),
  };
}

export function generateRandomFakeBlock(): IBlock {
  const txs: ITransaction[] = [];
  const countOfTx = Math.floor(Math.random() * 10 + 6);
  for (let i = 0; i < countOfTx; i++) {
    txs.push(generateFakeTx());
  }

  return {
    height: ++blockHeight,
    hash: hash(Math.random()),
    countOfTx,
    leanderNode: 'mishmish',
    timestamp: Date.now(),
    txs,
  };
}
