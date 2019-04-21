/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { waitUntil, getElementText } from './puppeteer-helpers';

export class MainPageDriver {
  public async navigate() {
    await page.goto('http://localhost:3000');
  }

  public async waitForBlockHeight(blockHeight: bigint, navigateToBlock: boolean): Promise<void> {
    const element = await page.waitForSelector(`#block-${blockHeight.toString()} [data-type="block-height"]`);
    await page.waitFor(100);
    if (navigateToBlock) {
      const link = await element.$('a');
      await link.click();
    }
  }

  public async waitForBlockDetailsPage(): Promise<void> {
    await page.waitForSelector('#block-details');
  }

  public async clickOnTx(txId: string): Promise<void> {
    console.log(`^^^ waitForSelector`);
    const element = await page.waitForSelector(`#tx-${txId.toLowerCase()}`);
    console.log(`^^^ waitFor 1_000`);
    await page.waitFor(1_000);
    console.log(`^^^ const link = await element.$('a');`);
    const link = await element.$('a');
    console.log(`^^^ await link.click();`);
    await link.click();
    console.log(`^^^ await page.waitForSelector('#tx-details');`);
    await page.waitForSelector('#tx-details');
  }

  public async getInputArg(idx: number): Promise<string> {
    return await getElementText(`#arg_${idx}`);
  }

  public async waitForBlocks(countOfBlocks: number): Promise<void> {
    await waitUntil(async () => (await this.getCountOfBlocks()) === countOfBlocks);
  }

  public async getVisibleBlockItems() {
    const blocksBox = await page.waitForSelector('#blocks-box');
    const blockItems = await blocksBox.$$('[data-type=block-item]');
    return blockItems;
  }

  public async getVisibleBlockItemsHeights(): Promise<number[]> {
    const blockItems = await this.getVisibleBlockItems();
    const promises = blockItems.map(async blockItem =>
      parseInt(await getElementText('[data-type=block-height]', blockItem), 10),
    );
    return await Promise.all(promises);
  }

  public async getCountOfBlocks() {
    return (await this.getVisibleBlockItems()).length;
  }
}
