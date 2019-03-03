import { MainPageDriver } from './main-page-driver';
import { OrbsClientSdkDriver } from './orbs-client-sdk-driver';

describe.only('Full cycle', () => {
  const orbsClientSdkDriver = new OrbsClientSdkDriver();
  const mainPageDriver = new MainPageDriver();

  beforeAll(async () => {
    await mainPageDriver.navigate();
    jest.setTimeout(20000);
  });

  it('should display the block that holds my transaction', async () => {
    const { txId, blockHeight } = await orbsClientSdkDriver.transferTokensTx(7);
    await mainPageDriver.waitForBlockHeight(blockHeight, true);
    await mainPageDriver.waitForBlockDetailsPage();
    await mainPageDriver.clickOnTx(txId);
  });
});
