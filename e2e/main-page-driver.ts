/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { getElementText, waitUntil } from './puppeteer-helpers';
import { Page } from 'puppeteer';
import * as puppeteer from 'puppeteer';

export class MainPageDriver {
  public async navigate() {
    try {
      await page.setViewport({ width: 1600, height: 900 });
      await page.goto('http://localhost:3000');
    } catch (e) {
      console.log('unable to navigate to localhot:3000');
      throw e;
    }
  }

  public async navigateToHome() {
    const homeLink = await page.waitForSelector('#home');
    await homeLink.click();
  }

  public async waitForBlockHeight(blockHeight: bigint, navigateToBlock: boolean): Promise<void> {
    const element = await page.waitForSelector(`#block-${blockHeight.toString()} [data-type="block-height"]`);
    if (navigateToBlock) {
      const link = await element.$('a');
      await link.click();
    }
  }

  public async waitForBlockDetailsPage(): Promise<void> {
    await page.waitForSelector('#block-details');
  }

  public async clickOnTx(txId: string): Promise<void> {
    const element = await page.waitForSelector(`#tx-${txId.toLowerCase()}`);
    const link = await element.$('a');
    await link.click();
    await page.waitForSelector('#tx-details');
  }

  public async getInputArg(idx: number): Promise<string> {
    return await getElementText(`#arg_${idx}`, page);
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
