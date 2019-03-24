/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

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
