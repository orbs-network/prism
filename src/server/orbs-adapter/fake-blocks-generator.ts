import { ExecutionResult } from 'orbs-client-sdk';
import { IRawBlock, IRawTx } from './OrbsAdapter';
import { uint8ArrayToHexString } from '../hash-converter/hashConverter';

let lastBlockHeight: bigint = BigInt(1);
function genUint8Array(len: number): Uint8Array {
  const result = new Uint8Array(len);
  for (let i: number = 0; i < len; i++) {
    result[i] = Math.floor(Math.random() * 255);
  }
  return result;
}

export function generateFakeTx(blockHash: string): IRawTx {
  return {
    txId: uint8ArrayToHexString(genUint8Array(40)),
    blockHash,
    protocolVersion: 1,
    virtualChainId: 42,
    timestamp: Date.now(),
    signerPublicKey: uint8ArrayToHexString(genUint8Array(50)),
    contractName: 'DummyContract',
    methodName: 'DummyMethod',
    inputArguments: [],
    executionResult: ExecutionResult.EXECUTION_RESULT_SUCCESS,
    outputArguments: [],
    outputEvents: [],
  };
}

export function generateRandomFakeBlock(blockHeight: bigint): IRawBlock {
  const blockHash: string = uint8ArrayToHexString(genUint8Array(32));
  const transactions: IRawTx[] = [];
  const numTransactions = Math.floor(Math.random() * 10 + 6);
  for (let i = 0; i < numTransactions; i++) {
    transactions.push(generateFakeTx(blockHash));
  }

  return {
    blockHeight: blockHeight.toString(),
    blockHash,
    timeStamp: Date.now(),
    transactions,
  };
}
