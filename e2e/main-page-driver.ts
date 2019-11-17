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
import { takeScreenshot } from "./screenshooter";

export class MainPageDriver {
  private page: Page;
  constructor(private browser: puppeteer.Browser) {}

  static async CreateInstance() {
    const browser = await puppeteer.launch();
    return new MainPageDriver(browser);
  }

  public async navigate() {
    try {
      this.page = await browser.newPage();
      await this.page.setViewport({ width: 1600, height: 900 });
      await this.page.goto('http://localhost:3000');
      await takeScreenshot('after_goto')
      await this.page.waitFor(3000);
      await takeScreenshot('after_goto_plus_3000ms')
    } catch (e) {
      console.log('unable to navigate to localhot:3000');
      throw e;
    }
  }

  public async close() {
    await this.browser.close();
  }

  public async navigateToHome() {
    const homeLink = await this.page.waitForSelector('#home');
    await homeLink.click();
  }

  public async waitForBlockHeight(blockHeight: bigint, navigateToBlock: boolean): Promise<void> {
    const element = await this.page.waitForSelector(`#block-${blockHeight.toString()} [data-type="block-height"]`);
    if (navigateToBlock) {
      const link = await element.$('a');
      await link.click();
    }
  }

  public async waitForBlockDetailsPage(): Promise<void> {
    await this.page.waitForSelector('#block-details');
  }

  public async clickOnTx(txId: string): Promise<void> {
    const element = await this.page.waitForSelector(`#tx-${txId.toLowerCase()}`);
    const link = await element.$('a');
    await link.click();
    await this.page.waitForSelector('#tx-details');
  }

  public async getInputArg(idx: number): Promise<string> {
    return await getElementText(`#arg_${idx}`, this.page);
  }

  public async waitForBlocks(countOfBlocks: number): Promise<void> {
    await waitUntil(async () => (await this.getCountOfBlocks()) === countOfBlocks);
  }

  public async getVisibleBlockItems() {
    const blocksBox = await this.page.waitForSelector('#blocks-box');
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
