import { MainPageDriver } from './main-page-driver';

expect.extend({
  toHaveAscendingValues: (values: number[]) => {
    let pass = true;
    for (let i = 0; i < values.length - 1; i++) {
      pass = pass && values[i] === values[i + 1] + 1;
    }

    if (pass) {
      return {
        message: () => `expected ${values} to not have ascending values`,
        pass,
      };
    } else {
      return {
        message: () => `expected ${values} to have ascending values`,
        pass,
      };
    }
  },
});

describe('Blocks progression', () => {
  const mainPageDriver = new MainPageDriver();
  beforeAll(async () => {
    await mainPageDriver.navigate();
  });

  it('should display 5 block items in order', async () => {
    await mainPageDriver.waitForBlocks(5);
    const blockItemsHeights = await mainPageDriver.getVisibleBlockItemsHeights();
    expect(blockItemsHeights).toHaveAscendingValues();
  });
});
