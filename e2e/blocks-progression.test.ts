const getElementText = async selector => await page.$eval(`${selector}`, el => el.innerText);

describe('Blocks progression', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  it('should display the app title', async () => {
    const orbsClientResult = await getElementText('');
    await expect(page).toMatchElement('#pageTitle', { text: 'Hubble - The ORBS Blockchain Explorer' });
  });
});
