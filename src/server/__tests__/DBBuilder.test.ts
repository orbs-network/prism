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
  let spyStorage: jest.SpyInstance;
  let spyDbStoreBlock: jest.SpyInstance;
  let spyDbStoreTxes: jest.SpyInstance;

  const rawBlock1: IRawBlock = generateRandomRawBlock(1n);
  const rawBlock2: IRawBlock = generateRandomRawBlock(2n);
  const rawBlock3: IRawBlock = generateRandomRawBlock(3n);
  const block1 = rawBlockToBlock(rawBlock1);
  const block2 = rawBlockToBlock(rawBlock2);
  const block3 = rawBlockToBlock(rawBlock3);

  beforeEach(async () => {
    db = new InMemoryDB();
    await db.init();
    await db.setVersion('1.0.0');
    storage = new Storage(db);
    orbsAdapter = new OrbsAdapterMock();
    orbsAdapter.setBlockChain([rawBlock1, rawBlock2, rawBlock3]);
    dbBuilder = new DBBuilder(db, storage, orbsAdapter);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  async function fillDbWithBlocks(): Promise<void> {
    await db.storeBlock(block1);
    await db.storeBlock(block2);
    await db.storeBlock(block3);
  }

  function expectDbToRebuild(): void {
    expect(spyStorage).toHaveBeenCalled();
    expect(spyDbStoreBlock).toHaveBeenCalled();
    expect(spyDbStoreTxes).toHaveBeenCalled();
  }

  function expectDbToNotRebuild(): void {
    expect(spyStorage).not.toHaveBeenCalled();
    expect(spyDbStoreBlock).not.toHaveBeenCalled();
    expect(spyDbStoreTxes).not.toHaveBeenCalled();
  }

  function initSpys(): void {
    spyStorage = jest.spyOn(storage, 'handleNewBlock');
    spyDbStoreBlock = jest.spyOn(db, 'storeBlock');
    spyDbStoreTxes = jest.spyOn(db, 'storeTxes');
  }

  it('should rebuild the db when the db is empty', async () => {
    expect(await db.getLatestBlockHeight()).toBe(0n);
    expect(await db.getBlockByHeight('1')).toBeNull();
    expect(await db.getBlockByHeight('2')).toBeNull();
    expect(await db.getBlockByHeight('3')).toBeNull();

    await dbBuilder.init('1.0.0');

    expect(await db.getLatestBlockHeight()).toBe(3n);
    expect(await db.getBlockByHeight('1')).toEqual(block1);
    expect(await db.getBlockByHeight('2')).toEqual(block2);
    expect(await db.getBlockByHeight('3')).toEqual(block3);
  });

  it('should not rebuild the db when the db has blocks', async () => {
    await fillDbWithBlocks();
    initSpys();
    await dbBuilder.init('1.0.0');
    expectDbToNotRebuild();
  });

  it('should rebuild the db when the db version is older', async () => {
    await fillDbWithBlocks();
    initSpys();
    await dbBuilder.init('2.0.0');
    expectDbToRebuild();
  });

  it('should not rebuild the db when the db version is newer', async () => {
    await fillDbWithBlocks();
    initSpys();
    await dbBuilder.init('0.0.4');
    expectDbToNotRebuild();
  });
});
