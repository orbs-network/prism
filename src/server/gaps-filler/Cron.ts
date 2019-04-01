/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

export const sleep = (time: number) => new Promise(resolve => setTimeout(() => resolve(), time));

export function cron(job: () => Promise<any>, interval: number): () => void {
  let stopped = false;
  const endlessLoop = async () => {
    while (!stopped) {
      await job();
      await sleep(interval);
    }
  };

  endlessLoop(); // not awaiting
  return () => (stopped = true);
}
