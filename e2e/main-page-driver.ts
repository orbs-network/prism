import { waitUntil, getElementText } from './puppeteer-helpers';

export class MainPageDriver {
  public async navigate() {
    await page.goto('http://localhost:3000');
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
