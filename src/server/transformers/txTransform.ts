import { IShortTx } from '../../shared/IContractData';
import { IRawTx, ITx } from '../../shared/IRawData';

/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

export function rawTxToTx(tx: IRawTx, idxInBlock: number): ITx {
  return { idxInBlock, ...tx };
}

// tx: Pick<IRawTx, 'blockHeight' | 'methodName' | 'txId' | 'signerAddress' | 'executionResult'>,

export function rawTxToShortTx(tx: IRawTx, contractExecutionIdx: number): IShortTx {
  return {
    blockHeight: tx.blockHeight.toString(),
    contractExecutionIdx,
    method: tx.methodName,
    txId: tx.txId,
    signerAddress: tx.signerAddress,
    successful: tx.executionResult === 'SUCCESS',
  };
}
