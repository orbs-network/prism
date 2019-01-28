import { IBlock } from '../shared/IBlock';

let blockHeight = 1;
export function generateRandomFakeBlock(): IBlock {
  return {
    height: ++blockHeight,
    hash: '',
    countOfTx: Math.floor(Math.random() * 1000 + 500),
    leanderNode: 'mishmish',
    timestamp: Date.now(),
  };
}
