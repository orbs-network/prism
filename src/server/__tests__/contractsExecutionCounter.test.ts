/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { InMemoryDB } from '../db/InMemoryDB';
import { ContractsExecutionCounter } from '../storage/contractsExecutionCounter';

describe('contractsExecutionCounter', () => {
  it('should increment the given contact', async () => {
    const db = new InMemoryDB();
    const contractsExecutionCounter = new ContractsExecutionCounter(db);
    contractsExecutionCounter.incExecutionCounter('contract_1');
    contractsExecutionCounter.incExecutionCounter('contract_2');
    contractsExecutionCounter.incExecutionCounter('contract_1');
    const actual = await contractsExecutionCounter.incExecutionCounter('contract_1');
    expect(actual).toEqual(3);
  });

  it('should persist the counter in the given db', async () => {
    const db = new InMemoryDB();
    const contractsExecutionCounter1 = new ContractsExecutionCounter(db);
    await contractsExecutionCounter1.init();
    contractsExecutionCounter1.incExecutionCounter('contract_1');
    contractsExecutionCounter1.incExecutionCounter('contract_2');
    contractsExecutionCounter1.incExecutionCounter('contract_1');
    contractsExecutionCounter1.incExecutionCounter('contract_1');

    const contractsExecutionCounter2 = new ContractsExecutionCounter(db);
    await contractsExecutionCounter2.init();
    contractsExecutionCounter2.incExecutionCounter('contract_1');
    contractsExecutionCounter2.incExecutionCounter('contract_2');
    contractsExecutionCounter2.incExecutionCounter('contract_1');
    const actual = await contractsExecutionCounter2.incExecutionCounter('contract_1');
    expect(actual).toEqual(6);
  });
});
