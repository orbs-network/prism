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
    await mainPageDriver.clickOnTx(txId);
    const sentAmountArg = await mainPageDriver.getInputArg(0);
    const targetAddressArg = await mainPageDriver.getInputArg(1);

    expect(sentAmountArg).toEqual(`${amountToSend.toString()} (uint64)`);
    expect(targetAddressArg.toLowerCase()).toEqual(`${receiverAddress.toLowerCase()} (bytes)`);
  });
});
