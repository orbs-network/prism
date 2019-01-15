describe('Blocks progression', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:3000');
  });

  it('should display the app title', async () => {
    await expect(page).toMatchElement('#pageTitle', { text: 'Hubble - The ORBS Blockchain Explorer' });
  });
});
