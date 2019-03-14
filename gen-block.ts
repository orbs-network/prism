#!/usr/bin/env ts-node --compiler-options {"lib":["esnext"]}
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
