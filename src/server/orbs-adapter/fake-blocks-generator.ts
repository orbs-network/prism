import { IRawBlock, IRawTx } from './IOrbsAdapter';

let lastBlockHeight: bigint = BigInt(1);
function genHash(): Uint8Array {
  const result = new Uint8Array(32);
  for (let i: number = 0; i < 32; i++) {
    result[i] = Math.floor(Math.random() * 255);
  }
  return result;
}

export function generateFakeTx(): IRawTx {
  return {
    txId: genHash(),
    data: Math.random().toString(),
  };
}

export function generateRandomFakeBlock(): IRawBlock {
  const blockHash: Uint8Array = genHash();
  const transactions: IRawTx[] = [];
  const numTransactions = Math.floor(Math.random() * 10 + 6);
  for (let i = 0; i < numTransactions; i++) {
    transactions.push(generateFakeTx());
  }

  return {
    blockHeight: ++lastBlockHeight,
    blockHash,
    timeStamp: new Date(),
    transactions,
  };
}
