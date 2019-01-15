import * as puppeteer from 'puppeteer';

describe('Blocks progression', () => {
  it('should display the app title', async () => {
    console.log('lunching chrome');
    const browser = await puppeteer.launch({
      headless: true,
    });
    console.log('opening new page');
    const page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 500,
        height: 2400,
      },
      userAgent: '',
    });

    console.log('go to localhost:3000');
    await page.goto('http://localhost:3000/');
    console.log('wait for selector');
    await page.waitForSelector('#pageTitle');

    console.log('eval the page title');
    const html = await page.$eval('#pageTitle', e => e.innerHTML);
    console.log('expecting');
    expect(html).toBe('Hubble - The ORBS Blockchain Explorer');

    browser.close();
  });
});
