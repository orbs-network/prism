import * as puppeteer from 'puppeteer';

describe('<User/>', () => {
  it('should display the user inside a Card component', async () => {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 500,
        height: 2400,
      },
      userAgent: '',
    });

    await page.goto('http://localhost:3000/');
    await page.waitForSelector('#pageTitle');

    const html = await page.$eval('#pageTitle', e => e.innerHTML);
    expect(html).toBe('Hubble - The ORBS Blockchain Explorer');

    browser.close();
  });
});
