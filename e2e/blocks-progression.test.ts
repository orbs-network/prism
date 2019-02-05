import { MainPageDriver } from './main-page-driver';

describe('Blocks progression', () => {
  const mainPageDriver = new MainPageDriver();
  beforeAll(async () => {
    await mainPageDriver.navigate();
    jest.setTimeout(10000);
  });

  it('should display 5 block items in order', async () => {
    await mainPageDriver.waitForBlocks(5);
    const blockItemsHeights = await mainPageDriver.getVisibleBlockItemsHeights();
    expect(blockItemsHeights).toHaveAscendingValues();
  });
});
