#!/usr/bin/env ts-node --compiler-options {"lib":["esnext"]}
/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { OrbsClientSdkDriver } from './e2e/orbs-client-sdk-driver';

(async () => {
  let blocksToCreate = 1;
  if (process.argv.length > 2) {
    blocksToCreate = parseInt(process.argv[2], 10);
  }
  const driver = new OrbsClientSdkDriver();

  for (let i = 0; i < blocksToCreate; i++) {
    console.log(`Creating block #${i + 1}`);
    await driver.transferTokensTx(1);
  }
  console.log('done');
})();
