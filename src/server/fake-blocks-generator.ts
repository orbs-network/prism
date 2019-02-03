import { IBlock } from '../shared/IBlock';
import * as hash from 'object-hash';

let blockHeight = 1;
export function generateRandomFakeBlock(): IBlock {
  return {
    height: ++blockHeight,
    hash: hash(Math.random()),
    countOfTx: Math.floor(Math.random() * 1000 + 500),
    leanderNode: 'mishmish',
    timestamp: Date.now(),
  };
}
