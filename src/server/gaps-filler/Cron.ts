export const sleep = (time: number) => new Promise(resolve => setTimeout(() => resolve(), time));

export function cron(job: () => Promise<any>, interval: number): () => void {
  let stopped = false;
  const endlessLoop = async () => {
    while (!stopped) {
      await job();
      await sleep(interval * 1_000 * 60);
    }
  };

  endlessLoop(); // not awaiting
  return () => (stopped = true);
}
