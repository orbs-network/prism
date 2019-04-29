/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { MainPageDriver } from './main-page-driver';
import { OrbsClientSdkDriver } from './orbs-client-sdk-driver';

describe('Full cycle', () => {
  const orbsClientSdkDriver = new OrbsClientSdkDriver();
  const mainPageDriver = new MainPageDriver();

  beforeAll(async () => {
    await mainPageDriver.navigate();
    jest.setTimeout(20000);
  });

  it('should display the block that holds my transaction', async () => {
    const amountToSend = 7;
    const { txId, blockHeight, receiverAddress } = await orbsClientSdkDriver.transferTokensTx(amountToSend);
    await mainPageDriver.waitForBlockHeight(blockHeight, true);
    await mainPageDriver.waitForBlockDetailsPage();
    await page.waitFor(2000);
    await mainPageDriver.clickOnTx(txId);
    await page.waitFor(2000);
    const sentAmountArg = await mainPageDriver.getInputArg(0);
    const targetAddressArg = await mainPageDriver.getInputArg(1);

    expect(sentAmountArg).toEqual(amountToSend.toString());
    expect(targetAddressArg.toLowerCase()).toEqual(receiverAddress.toLowerCase());
  });
});
