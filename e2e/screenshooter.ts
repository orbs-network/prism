import * as fs from 'fs';
const cloudinary = require('cloudinary').v2;

const toFilename = (s: string) => s.replace(/[^a-z0-9.-]+/gi, '_');

const upload = filePath => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.url);
      }
    });
  });
};

export const takeScreenshot = async (name: string) => {
  const path = toFilename(`${new Date().toISOString()}_${name}.png`);
  await page.screenshot({ path });
  const uploadedFileUrl = await upload(path);
  console.log(`Screenshot for "${name}" uploaded to: ${uploadedFileUrl}`);
  fs.unlinkSync(path);
};

export const registerScreenshotReporter = () => {
  /**
   * jasmine reporter does not support async.
   * So we store the screenshot promise and wait for it before each test
   */
  let screenshotPromise: Promise<any> = Promise.resolve();
  beforeEach(() => screenshotPromise);
  afterAll(() => screenshotPromise);

  /**
   * Take a screenshot on Failed test.
   * Jest standard reporters run in a separate process so they don't have
   * access to the page instance. Using jasmine reporter allows us to
   * have access to the test result, test name and page instance at the same time.
   */
  (jasmine as any).getEnv().addReporter({
    specDone: async (result: any) => {
      if (result.status === 'failed') {
        screenshotPromise = screenshotPromise.catch().then(() => takeScreenshot(result.fullName));
      }
    },
  });
};
