import { IShortTx } from '../../shared/IContractData';
import { IRawTx } from '../orbs-adapter/IRawData';

/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

export function txToShortTx(tx: Pick<IRawTx, 'methodName' | 'txId' | 'signerAddress' | 'executionResult'>): IShortTx {
  return {
    method: tx.methodName,
    txId: tx.txId,
    signerAddress: tx.signerAddress,
    successful: tx.executionResult === 'SUCCESS',
  };
}
