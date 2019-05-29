/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IRawBlock } from '../../shared/IRawData';
import { DBBuilder } from '../db/DBBuilder';
import { IDB } from '../db/IDB';
import { InMemoryDB } from '../db/InMemoryDB';
import { generateRandomRawBlock } from '../orbs-adapter/fake-blocks-generator';
import { Storage } from '../storage/storage';
import { rawBlockToBlock } from '../transformers/blockTransform';
import { OrbsAdapterMock } from './mocks/OrbsAdapterMock';

describe(`DBBuilder`, async () => {
  let db: IDB;
  let storage: Storage;
  let orbsAdapter: OrbsAdapterMock;
  let dbBuilder: DBBuilder;

  beforeEach(async () => {
    db = new InMemoryDB();
    await db.init();
    storage = new Storage(db);
    orbsAdapter = new OrbsAdapterMock();
    dbBuilder = new DBBuilder(db, storage, orbsAdapter);
  });

  it('should rebuild the db when the db is empty', async () => {
    const block1: IRawBlock = generateRandomRawBlock(1n);
    const block2: IRawBlock = generateRandomRawBlock(2n);
    const block3: IRawBlock = generateRandomRawBlock(3n);
    orbsAdapter.setBlockChain([block1, block2, block3]);

    // before
    expect(await db.getLatestBlockHeight()).toBe(0n);
    expect(await db.getBlockByHeight('1')).toBeNull();
    expect(await db.getBlockByHeight('2')).toBeNull();
    expect(await db.getBlockByHeight('3')).toBeNull();

    await dbBuilder.init();

    // after
    expect(await db.getLatestBlockHeight()).toBe(3n);
    expect(await db.getBlockByHeight('1')).toEqual(rawBlockToBlock(block1));
    expect(await db.getBlockByHeight('2')).toEqual(rawBlockToBlock(block2));
    expect(await db.getBlockByHeight('3')).toEqual(rawBlockToBlock(block3));
  });

  it('should not rebuild the db when the db has blocks', async () => {
    await db.storeBlock(rawBlockToBlock(generateRandomRawBlock(1n)));
    await db.storeBlock(rawBlockToBlock(generateRandomRawBlock(2n)));
    await db.storeBlock(rawBlockToBlock(generateRandomRawBlock(3n)));

    const spyStorage = jest.spyOn(storage, 'handleNewBlock');
    const spyDbStoreBlock = jest.spyOn(db, 'storeBlock');
    const spyDbStoreTxes = jest.spyOn(db, 'storeTxes');

    await dbBuilder.init();

    expect(spyStorage).not.toHaveBeenCalled();
    expect(spyDbStoreBlock).not.toHaveBeenCalled();
    expect(spyDbStoreTxes).not.toHaveBeenCalled();
  });
});
