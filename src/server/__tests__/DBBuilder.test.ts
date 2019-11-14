/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { OrbsBlocksPollingMock } from 'orbs-blocks-polling-js/dist/testkit';
import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { DBBuilder } from '../db/DBBuilder';
import { IDB } from '../db/IDB';
import { InMemoryDB } from '../db/InMemoryDB';
import { generateRandomGetBlockRespose } from '../orbs-adapter/fake-blocks-generator';
import { Storage } from '../storage/storage';
import { blockResponseToBlock } from '../transformers/blockTransform';

describe(`DBBuilder`, () => {
  let db: IDB;
  let storage: Storage;
  let orbsBlocksPolling: OrbsBlocksPollingMock;
  let dbBuilder: DBBuilder;
  let spyStorage: jest.SpyInstance;
  let spyDbStoreBlock: jest.SpyInstance;
  let spyDbStoreTxes: jest.SpyInstance;
  let spyDbClear: jest.SpyInstance;

  const blockResponse1: GetBlockResponse = generateRandomGetBlockRespose(1n);
  const blockResponse2: GetBlockResponse = generateRandomGetBlockRespose(2n);
  const blockResponse3: GetBlockResponse = generateRandomGetBlockRespose(3n);
  const block1 = blockResponseToBlock(blockResponse1);
  const block2 = blockResponseToBlock(blockResponse2);
  const block3 = blockResponseToBlock(blockResponse3);

  beforeEach(async () => {
    db = new InMemoryDB();
    await db.init();
    await db.setVersion('1.0.0');
    storage = new Storage(db);
    orbsBlocksPolling = new OrbsBlocksPollingMock();
    orbsBlocksPolling.setBlockChain([blockResponse1, blockResponse2, blockResponse3]);
    dbBuilder = new DBBuilder(db, storage, orbsBlocksPolling);
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

  function expectDbToBeCleared(): void {
    expect(spyDbClear).toHaveBeenCalled();
  }

  function expectDbToNotBeCleared(): void {
    expect(spyDbClear).not.toHaveBeenCalled();
  }

  function initSpys(): void {
    spyStorage = jest.spyOn(storage, 'handleNewBlock');
    spyDbStoreBlock = jest.spyOn(db, 'storeBlock');
    spyDbStoreTxes = jest.spyOn(db, 'storeTxes');
    spyDbClear = jest.spyOn(db, 'clearAll');
  }

  it('should rebuild the db when the db is empty', async () => {
    expect(await db.getLatestBlockHeight()).toBe(0n);
    expect(await db.getBlockByHeight('1')).toBeNull();
    expect(await db.getBlockByHeight('2')).toBeNull();
    expect(await db.getBlockByHeight('3')).toBeNull();

    initSpys();
    await dbBuilder.init('1.0.0');

    expectDbToNotBeCleared();

    expect(await db.getLatestBlockHeight()).toBe(3n);
    expect(await db.getBlockByHeight('1')).toEqual(block1);
    expect(await db.getBlockByHeight('2')).toEqual(block2);
    expect(await db.getBlockByHeight('3')).toEqual(block3);
  });

  it('should not rebuild the db when the db has blocks', async () => {
    await fillDbWithBlocks();
    initSpys();
    await dbBuilder.init('1.0.0');
    expectDbToNotBeCleared();
    expectDbToNotRebuild();
  });

  it('should rebuild the db when the db version is older', async () => {
    await fillDbWithBlocks();
    initSpys();
    await dbBuilder.init('2.0.0');
    expectDbToBeCleared();
    expectDbToRebuild();
  });

  it('should not rebuild the db when the db version is newer', async () => {
    await fillDbWithBlocks();
    initSpys();
    await dbBuilder.init('0.0.4');
    expectDbToNotBeCleared();
    expectDbToNotRebuild();
  });
});
