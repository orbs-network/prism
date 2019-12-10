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
import 'jest-expect-message';

describe(`DBBuilder`, () => {
  const PRISM_VERSION = '1.0.0';

  let db: IDB;
  let storage: Storage;
  let orbsBlocksPolling: OrbsBlocksPollingMock;
  let dbBuilder: DBBuilder;

  let spyStorageHandleNewBlock: jest.SpyInstance;
  let spyDbStoreBlock: jest.SpyInstance;
  let spyDbStoreTxes: jest.SpyInstance;
  let spyDbClear: jest.SpyInstance;
  let spyDbSetDbFillingMethod: jest.SpyInstance;
  let spyDbSetDbBuildingStatus: jest.SpyInstance;
  let spyBlocksPollingGetBlock: jest.SpyInstance;

  const blockResponse1: GetBlockResponse = generateRandomGetBlockRespose(1n);
  const blockResponse2: GetBlockResponse = generateRandomGetBlockRespose(2n);
  const blockResponse3: GetBlockResponse = generateRandomGetBlockRespose(3n);
  const block1 = blockResponseToBlock(blockResponse1);
  const block2 = blockResponseToBlock(blockResponse2);
  const block3 = blockResponseToBlock(blockResponse3);

  beforeEach(async () => {
    db = new InMemoryDB();
    await db.init();
    await db.setVersion(PRISM_VERSION);
    storage = new Storage(db);

    orbsBlocksPolling = new OrbsBlocksPollingMock();
    orbsBlocksPolling.setBlockChain([blockResponse1, blockResponse2, blockResponse3]);

    dbBuilder = new DBBuilder(db, storage, orbsBlocksPolling, {
      blocksBatchSize: 100,
      blocksChunkSize: 20,
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  /**
   * Dev_Note: We call this function manually so not to get noise from db building functions (like 'fillDbWithBlocks')
   */
  function initSpies(): void {
    spyStorageHandleNewBlock = jest.spyOn(storage, 'handleNewBlock');
    spyDbStoreBlock = jest.spyOn(db, 'storeBlock');
    spyDbStoreTxes = jest.spyOn(db, 'storeTxes');
    spyDbClear = jest.spyOn(db, 'clearAll');
    spyDbSetDbFillingMethod = jest.spyOn(db, 'setDBFillingMethod');
    spyDbSetDbBuildingStatus = jest.spyOn(db, 'setDBBuildingStatus');
    spyBlocksPollingGetBlock = jest.spyOn(orbsBlocksPolling, 'getBlockAt');
  }

  async function fillDbWithBlocks(): Promise<void> {
    await db.storeBlock(block1);
    await db.storeBlock(block2);
    await db.storeBlock(block3);
  }

  function expectDbToRebuild(): void {
    expect(spyStorageHandleNewBlock, '"Handle new block" to be called').toHaveBeenCalled();
    expect(spyDbStoreBlock, '"Store Block" to be called').toHaveBeenCalled();
    expect(spyDbStoreTxes, '"Store Txes" to be called').toHaveBeenCalled();
  }

  function expectDbToNotRebuild(): void {
    expect(spyStorageHandleNewBlock, '"Handle new block" not to be called').not.toHaveBeenCalled();
    expect(spyDbStoreBlock, '"Store Block" not to be called').not.toHaveBeenCalled();
    expect(spyDbStoreTxes, '"Store Txes" not to be called').not.toHaveBeenCalled();
  }

  function expectDbToBeCleared(): void {
    expect(spyDbClear, 'Function clearDB should get called').toHaveBeenCalled();
  }

  function expectDbToNotBeCleared(): void {
    expect(spyDbClear, 'Function clearDB should NOT get called').not.toHaveBeenCalled();
  }

  function expectFullDBBuildFromZero(availableBlocks: number, mockedBlocks: GetBlockResponse[]): void {
    const expectedBlockHeights = [...Array(availableBlocks).keys()];
    // TODO : ORL : Block generation and mocking should happen before calling this function
    const blocks = expectedBlockHeights.map(h => generateRandomGetBlockRespose(BigInt(h)));
    orbsBlocksPolling.setBlockChain(blocks);

    // Reading of blocks
    expect(spyBlocksPollingGetBlock, 'Should call "getBlockAt" for each block').toBeCalledWith(expectedBlockHeights);
    expect(spyBlocksPollingGetBlock, 'Should call "getBlockAt" number-of-blocks times').toBeCalledTimes(availableBlocks);

    // Handling of blocks
    expect(spyStorageHandleNewBlock, 'Should call "handleNewBlock" with all of the mocked blocks').toBeCalledWith(mockedBlocks);
    expect(spyStorageHandleNewBlock, 'Should call "handleNewBlock" number-of-blocks times').toBeCalledTimes(availableBlocks);

    // Signal transition of 'Db filling method'
    expect(spyDbSetDbFillingMethod, 'Should set "DB filling method" to "DbBuilder" and then "None" ').toBeCalledWith(['DBBuilder', 'None']);
    expect(spyDbSetDbFillingMethod, 'Call "setDbFillingMethod twice"').toBeCalledTimes(2);

    // Signal transition of 'Db Building status'
    expect(spyDbSetDbBuildingStatus, 'Should set "DB filling method" to "In Work" and then "Done" ').toBeCalledWith(['InWork', 'Done']);
    expect(spyDbSetDbBuildingStatus, 'Call "setDbBuildingStatus twice"').toBeCalledTimes(2);

    // Signal the last block that was build
    const lastBuiltBlockHeight = db.getLastBuiltBlockHeight();
    expect(lastBuiltBlockHeight).toEqual(availableBlocks - 1);
  }

  function expectFullDBBuildFromPreviousPoint(availableBlocks: number, lastBuiltBlockHeight: number, mockedBlocks: GetBlockResponse[]): void {
    const expectedBlockHeights = [...Array(availableBlocks).keys()].slice(lastBuiltBlockHeight + 1);
    const totalBlocksToRead = availableBlocks - lastBuiltBlockHeight;

    // Reading of blocks
    expect(spyBlocksPollingGetBlock, 'Should call "getBlockAt" for each block').toBeCalledWith(expectedBlockHeights);
    expect(spyBlocksPollingGetBlock, 'Should call "getBlockAt" number-of-blocks times').toBeCalledTimes(totalBlocksToRead);

    // Handling of blocks
    expect(spyStorageHandleNewBlock, 'Should call "handleNewBlock" with all of the mocked blocks').toBeCalledWith(mockedBlocks);
    expect(spyStorageHandleNewBlock, 'Should call "handleNewBlock" number-of-blocks times').toBeCalledTimes(availableBlocks);

    // Signal transition of 'Db filling method'
    expect(spyDbSetDbFillingMethod, 'Should set "DB filling method" to "DbBuilder" and then "None" ').toBeCalledWith(['DBBuilder', 'None']);
    expect(spyDbSetDbFillingMethod, 'Call "setDbFillingMethod twice"').toBeCalledTimes(2);

    // Signal transition of 'Db Building status'
    expect(spyDbSetDbBuildingStatus, 'Should set "DB filling method" to "Done"').toBeCalledWith(['Done']);
    expect(spyDbSetDbBuildingStatus, 'Call "setDbBuildingStatus once"').toBeCalledTimes(1);

    // Signal the last block that was build
    const updatedLastBuiltBlockHeight = db.getLastBuiltBlockHeight();
    expect(updatedLastBuiltBlockHeight).toEqual(availableBlocks - 1);
  }

  function expectNothingToHappen() {
    expectDbToNotBeCleared();
    expectDbToNotRebuild();
  }

  describe('DB is Empty', () => {
    it('Should rebuild the DB when the DB is empty', async () => {
      initSpies();
      await dbBuilder.init(PRISM_VERSION);

      // Ensure empty db
      expect(await db.getLatestBlockHeight()).toBe(0n);

      const existingBlocksInChain = 100;
      const blocks = [...Array(existingBlocksInChain).keys()].map(h => generateRandomGetBlockRespose(BigInt(h)));

      orbsBlocksPolling.setBlockChain(blocks);

      await expectFullDBBuildFromZero(existingBlocksInChain, blocks);
    });
  });

  describe('DB has some blocks', () => {
    /**
     * Signals that there are blocks in the db.
     */
    beforeEach(async () => {
      await fillDbWithBlocks();
    });


    it('Should do nothing when DB-Version > Prism-Version', async () => {
      initSpies();
      await dbBuilder.init('0.5.5');

      expectNothingToHappen();
    });

    it('Should clear the DB and rebuild from zero when the DB-Version < Prism-Version', async () => {
      const existingBlocksInChain = 100;
      const blocks = [...Array(existingBlocksInChain).keys()].map(h => generateRandomGetBlockRespose(BigInt(h)));

      orbsBlocksPolling.setBlockChain(blocks);

      initSpies();
      await dbBuilder.init('2.0.0');

      expectDbToBeCleared();
      expectFullDBBuildFromZero(existingBlocksInChain, blocks);
    });

    it ('Should do nothing when DB-Version == Prism-version AND "Db Building status" == "Done"', async () => {
      await db.setDBBuildingStatus('Done');

      initSpies();
      await dbBuilder.init(PRISM_VERSION);

      expectNothingToHappen();
    });

    it ('Should rebuild from zero when DB-Version == Prism-version AND "Db Building status" == "None"', async () => {
      await db.setDBBuildingStatus('None');

      const existingBlocksInChain = 100;
      const blocks = [...Array(existingBlocksInChain).keys()].map(h => generateRandomGetBlockRespose(BigInt(h)));

      orbsBlocksPolling.setBlockChain(blocks);

      initSpies();
      await dbBuilder.init(PRISM_VERSION);

      expectFullDBBuildFromZero(existingBlocksInChain, blocks);
    });

    it ('Should rebuild from last built block when DB-Version == Prism-version AND "Db Building status" == "In Work"', async () => {
      await db.setDBBuildingStatus('InWork');

      const existingBlocksInChain = 300;
      const lastBuiltBlock = 120;
      const blocks = [...Array(existingBlocksInChain).keys()].map(h => generateRandomGetBlockRespose(BigInt(h)));

      orbsBlocksPolling.setBlockChain(blocks);
      await db.setLastBuiltBlockHeight(lastBuiltBlock);

      initSpies();
      await dbBuilder.init(PRISM_VERSION);

      expectFullDBBuildFromPreviousPoint(existingBlocksInChain, lastBuiltBlock, blocks);
    });
  });

  describe('Validity checks', () => {
    it ('Should throw an error when there are block AND DB-Version == Prism-version AND "Db Building status" == Unknown value', async () => {

      // Signal that there are some blocks in the DB
      await fillDbWithBlocks();

      // @ts-ignore (Intentionally for the test's sake)
      await db.setDBBuildingStatus('NonExistingValue');

      await expect(dbBuilder.init(PRISM_VERSION)).rejects.toThrow();
    });
  });

  describe('Older tests', () => {
    it('should rebuild the db when the db is empty', async () => {
      expect(await db.getLatestBlockHeight()).toBe(0n);
      expect(await db.getBlockByHeight('1')).toBeNull();
      expect(await db.getBlockByHeight('2')).toBeNull();
      expect(await db.getBlockByHeight('3')).toBeNull();

      initSpies();
      await dbBuilder.init(PRISM_VERSION);

      expectDbToNotBeCleared();

      expect(await db.getLatestBlockHeight()).toBe(3n);
      expect(await db.getBlockByHeight('1')).toEqual(block1);
      expect(await db.getBlockByHeight('2')).toEqual(block2);
      expect(await db.getBlockByHeight('3')).toEqual(block3);
    });

    it('should not rebuild the db when the db has blocks', async () => {
      await fillDbWithBlocks();
      initSpies();
      await dbBuilder.init(PRISM_VERSION);
      expectDbToNotBeCleared();
      expectDbToNotRebuild();
    });

    it('should clear & rebuild the db + set new version when the db version is older', async () => {
      await fillDbWithBlocks();
      initSpies();
      await dbBuilder.init('2.0.0');
      expectDbToBeCleared();
      expectDbToRebuild();
    });

    it('should not rebuild the db when the db version is newer', async () => {
      await fillDbWithBlocks();
      initSpies();
      await dbBuilder.init('0.0.4');
      expectDbToNotBeCleared();
      expectDbToNotRebuild();
    });
  });
});
