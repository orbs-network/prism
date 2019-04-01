/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { cron, sleep } from '../gaps-filler/Cron';

describe('Cron', () => {
  it('should run async job every interval', async () => {
    let counter = 0;
    const job = async () => counter++;
    const stop = cron(job, 100);
    await sleep(500);
    expect(counter).toBeGreaterThanOrEqual(4);
    stop();
  });
});
