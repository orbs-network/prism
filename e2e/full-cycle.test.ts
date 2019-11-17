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
  let mainPageDriver: MainPageDriver;

  beforeAll(async () => {
    mainPageDriver = await MainPageDriver.CreateInstance();
    jest.setTimeout(20000);
    await mainPageDriver.navigate();
  });

  afterAll(async () => {
    await mainPageDriver.close();
  })
  it('should display the block that holds my transaction', async () => {
    const amountToSend = 7;
    console.log(' ******************** 1');
    const { txId, blockHeight, receiverAddress } = await orbsClientSdkDriver.transferTokensTx(amountToSend);
    console.log(' ******************** 2');
    await mainPageDriver.waitForBlockHeight(blockHeight, true);
    console.log(' ******************** 3');
    await mainPageDriver.waitForBlockDetailsPage();
    console.log(' ******************** 4');
    await mainPageDriver.clickOnTx(txId);
    console.log(' ******************** 5');
    const sentAmountArg = await mainPageDriver.getInputArg(0);
    console.log(' ******************** 6');
    const targetAddressArg = await mainPageDriver.getInputArg(1);
    console.log(' ******************** 7');

    expect(sentAmountArg).toEqual(amountToSend.toString());
    expect(targetAddressArg.toLowerCase()).toEqual(receiverAddress.toLowerCase());
  });
});
