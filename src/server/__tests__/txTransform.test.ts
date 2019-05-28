/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IShortTx } from '../../shared/IContractData';
import { generateRandomRawBlock } from '../orbs-adapter/fake-blocks-generator';
import { rawTxToShortTx } from '../transformers/txTransform';

describe('txTransform', () => {
  it('should convert IRawTx to IShortTx', async () => {
    const block = generateRandomRawBlock(1n);

    const failingTx = block.transactions[0];
    failingTx.executionResult = 'ERROR';
    const actualFailing = rawTxToShortTx(failingTx);
    const expectedFailing: IShortTx = {
      blockHeight: '1',
      method: failingTx.methodName,
      txId: failingTx.txId,
      signerAddress: failingTx.signerAddress,
      successful: false,
    };
    expect(expectedFailing).toEqual(actualFailing);

    const successTx = block.transactions[1];
    successTx.executionResult = 'SUCCESS';

    const actualSuccess = rawTxToShortTx(successTx);
    const expectedSuccess: IShortTx = {
      blockHeight: '1',
      method: successTx.methodName,
      txId: successTx.txId,
      signerAddress: successTx.signerAddress,
      successful: true,
    };
    expect(expectedSuccess).toEqual(actualSuccess);
  });
});
