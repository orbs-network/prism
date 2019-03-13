import { cron, sleep } from '../gaps-filler/Cron';

describe('Cron', () => {

  it('should run async job every interval', async () => {
    let counter = 0;
    const job = async () => counter++;
    const stop = cron(job, 100 / 1_000 / 60);
    await sleep(500);
    expect(counter).toBeGreaterThanOrEqual(4);
    stop();
  });
});
