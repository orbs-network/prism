/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IShortTx } from '../../shared/IContractData';
import { generateRandomGetBlockResponse } from '../orbs-adapter/fake-blocks-generator';
import { blockResponseTransactionAsTx } from '../transformers/blockTransform';
import { txToShortTx } from '../transformers/txTransform';

describe('txTransform', () => {
  it('should convert ITx to IShortTx', async () => {
    const block = generateRandomGetBlockResponse(1n);

    const failingTx = blockResponseTransactionAsTx(block, 0);
    failingTx.executionResult = 'ERROR';
    const actualFailing = txToShortTx(failingTx, 10);
    const expectedFailing: IShortTx = {
      blockHeight: '1',
      executionIdx: 10,
      method: failingTx.methodName,
      txId: failingTx.txId,
      signerAddress: failingTx.signerAddress,
      successful: false,
    };
    expect(expectedFailing).toEqual(actualFailing);

    const successTx = blockResponseTransactionAsTx(block, 1);
    successTx.executionResult = 'SUCCESS';

    const actualSuccess = txToShortTx(successTx, 12);
    const expectedSuccess: IShortTx = {
      blockHeight: '1',
      executionIdx: 12,
      method: successTx.methodName,
      txId: successTx.txId,
      signerAddress: successTx.signerAddress,
      successful: true,
    };
    expect(expectedSuccess).toEqual(actualSuccess);
  });
});
