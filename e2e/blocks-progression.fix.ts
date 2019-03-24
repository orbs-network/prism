/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { MainPageDriver } from './main-page-driver';

describe('Blocks progression', () => {
  const mainPageDriver = new MainPageDriver();
  beforeAll(async () => {
    await mainPageDriver.navigate();
    jest.setTimeout(20000);
  });

  it('should display 5 block items in order', async () => {
    await mainPageDriver.waitForBlocks(5);
    const blockItemsHeights = await mainPageDriver.getVisibleBlockItemsHeights();
    expect(blockItemsHeights).toHaveAscendingValues();
  });
});
