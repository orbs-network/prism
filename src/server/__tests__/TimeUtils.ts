import { sleep } from '../gaps-filler/Cron';

export async function waitUntil(
  predicate: () => Promise<boolean>,
  timeout: number = 5_000,
  interval: number = 50,
): Promise<void> {
  const endTime = Date.now() + timeout;
  while (endTime > Date.now()) {
    if (await predicate()) {
      return;
    }

    await sleep(interval);
  }

  throw new Error('waitUtil reached timeout');
}
