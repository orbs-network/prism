/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IShortTx } from '../../shared/IContractData';
import { generateRandomRawBlock } from '../orbs-adapter/fake-blocks-generator';
import { txToShortTx } from '../transformers/txTransform';

describe('txTransform', () => {
  it('should convert IRawTx to IShortTx', async () => {
    const block1 = generateRandomRawBlock(1n);
    const tx = block1.transactions[0];
    const actual = txToShortTx(tx);
    const expected: IShortTx = {
      method: tx.methodName,
      txId: tx.txId,
      signerAddress: tx.signerAddress,
      successful: tx.executionResult === 'SUCCESS',
    };
    expect(expected).toEqual(actual);
  });
});
