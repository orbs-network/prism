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
import { generateRandomGetBlockResponse } from '../orbs-adapter/fake-blocks-generator';
import { Storage } from '../storage/storage';
import { blockResponseToBlock } from '../transformers/blockTransform';
import 'jest-expect-message';
import { encodeHex } from 'orbs-client-sdk';
import {getTestingLogger} from './testingLogger';
import {DBBuilderError, TDBBuilderErrorCode} from '../db/DBBuilderError';
import * as winston from 'winston';
import {genLogger} from '../logger/LoggerFactory';

describe(`DBBuilder`, () => {
  const dbVersionForTest = 5;
  const BLOCKCHAIN_LENGTH = 100;
  const DB_BUILDING_BATCH_SIZE = 50;
  const DB_BUILDING_MAX_PARALLEL_PROMISES = 20;
  const logger: winston.Logger = genLogger(false, false, false);

  let db: IDB;
  let storage: Storage;
  let orbsBlocksPolling: OrbsBlocksPollingMock;
  let dbBuilder: DBBuilder;

  let spyStorageHandleNewBlock: jest.SpyInstance;
  let spyDbStoreBlock: jest.SpyInstance;
  let spyDbStoreTxes: jest.SpyInstance;
  let spyDbClear: jest.SpyInstance;
  let spyDbSetDbBuildingStatus: jest.SpyInstance;
  let spyBlocksPollingGetBlock: jest.SpyInstance;
  let spySetDbVersion: jest.SpyInstance;

  const blockResponse1: GetBlockResponse = generateRandomGetBlockResponse(1n);
  const blockResponse2: GetBlockResponse = generateRandomGetBlockResponse(2n);
  const blockResponse3: GetBlockResponse = generateRandomGetBlockResponse(3n);
  const block1 = blockResponseToBlock(blockResponse1);
  const block2 = blockResponseToBlock(blockResponse2);
  const block3 = blockResponseToBlock(blockResponse3);

  beforeEach(async () => {
    db = new InMemoryDB();
    await db.init();
    await db.setVersion(dbVersionForTest);
    storage = new Storage(db, logger);

    orbsBlocksPolling = new OrbsBlocksPollingMock();
    orbsBlocksPolling.setBlockChain([blockResponse1, blockResponse2, blockResponse3]);

    dbBuilder = new DBBuilder(db, storage, orbsBlocksPolling, getTestingLogger(), {
      blocksBatchSize: DB_BUILDING_BATCH_SIZE,
      maxParallelPromises: DB_BUILDING_MAX_PARALLEL_PROMISES,
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
    spyDbSetDbBuildingStatus = jest.spyOn(db, 'setDBBuildingStatus');
    spySetDbVersion = jest.spyOn(db, 'setVersion');
    spyBlocksPollingGetBlock = jest.spyOn(orbsBlocksPolling, 'getBlockAt');
  }

  async function fillDbWithBlocks(): Promise<void> {
    await db.storeBlock(block1);
    await db.storeBlock(block2);
    await db.storeBlock(block3);
  }

  /**
   * As Jest do not have BigInt support yet. this will convert all BigInt calls to numbers.
   */
  function DEV_TO_REMOVE_convertMockBigIntToNumber() {
        spyBlocksPollingGetBlock.mock.calls = spyBlocksPollingGetBlock.mock.calls.map(call => call.map(v => Number(v)));
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

  async function expectFullDBBuildFromZero(highestExistingBlock: number, mockedBlocks: GetBlockResponse[]): Promise<void> {
    const expectedBlockHeights = generateAllBlockHeightsForChainLength(highestExistingBlock);

    await expectProperDBBuilding(highestExistingBlock, expectedBlockHeights, mockedBlocks);
  }

  async function expectFullDBBuildFromPreviousPoint(highestExistingBlock: number, lastBuiltBlockHeight: number, mockedBlocks: GetBlockResponse[]): Promise<void> {
    const expectedBlockHeights = generateAllBlockHeightsForChainLength(highestExistingBlock).slice(lastBuiltBlockHeight);
    const expectedBlocks = mockedBlocks.filter(b => expectedBlockHeights.includes(Number(b.blockHeight)));

    await expectProperDBBuilding(highestExistingBlock, expectedBlockHeights, expectedBlocks);
  }

  async function expectProperDBBuilding(highestExistingBlock: number, expectedBlockHeights: number[], expectedBlocks: GetBlockResponse[]) {
    DEV_TO_REMOVE_convertMockBigIntToNumber();

    await expectProperDBBuildingUnitTests(highestExistingBlock, expectedBlockHeights, expectedBlocks);
    await expectProperDBBuildingE2ETests(highestExistingBlock, expectedBlockHeights, expectedBlocks);
  }

  async function expectProperDBBuildingUnitTests(highestExistingBlock: number, expectedBlockHeights: number[], expectedBlocks: GetBlockResponse[]) {
    const totalBlocksToRead = expectedBlockHeights.length;

    // Reading of blocks (Unit tests)
    expect(spyBlocksPollingGetBlock, 'Should call "getBlockAt" number-of-blocks times').toBeCalledTimes(totalBlocksToRead);
    for (const height of expectedBlockHeights) {
      expect(spyBlocksPollingGetBlock, `Should call "getBlockAt" for each block - ${height}`).toBeCalledWith(height);
    }

    // Handling of blocks (Unit tests)
    expect(spyStorageHandleNewBlock, 'Should call "handleNewBlock" number-of-blocks times').toBeCalledTimes(totalBlocksToRead);
    for (const mockedBlock of expectedBlocks) {
      expect(spyStorageHandleNewBlock, `Should call "handleNewBlock" with all of the mocked blocks - ${mockedBlock}`).toBeCalledWith(mockedBlock);
    }

    // Signal transition of 'Db Building status' (Unit tests)
    expect(spyDbSetDbBuildingStatus, 'Should set "DB Building Status" to "In Work" and then to "Done"').toHaveBeenNthCalledWith(1, 'InWork');
    expect(spyDbSetDbBuildingStatus, 'Should set "DB Building Status" to "In Work" and then to "Done"').toHaveBeenNthCalledWith(2, 'Done');
    expect(spyDbSetDbBuildingStatus, 'Call "setDbBuildingStatus once"').toBeCalledTimes(2);
  }

  async function expectProperDBBuildingE2ETests(highestExistingBlock: number, expectedBlockHeights: number[], expectedBlocks: GetBlockResponse[]) {
    const totalBlocksToRead = expectedBlockHeights.length;

    // Handling of blocks
    expect(spyStorageHandleNewBlock, 'Should call "handleNewBlock" number-of-blocks times').toBeCalledTimes(totalBlocksToRead);
    for (const mockedBlock of expectedBlocks) {
      const blockFromDb = await storage.getBlockByHash(encodeHex(mockedBlock.resultsBlockHash));

      // DEV_NOTE : For now we only perform a shallow check, that the block and its transactions are defined.
      expect(blockFromDb, 'There should be a block stored in the DB with the hash').toBeDefined();
      expect(blockFromDb.blockHeight, 'Stored block should have the same height as the given block').toBe(mockedBlock.blockHeight.toString());

      for (const transaction of mockedBlock.transactions) {
        const txIdHex = encodeHex(transaction.txId);
        const dbTransaction = await storage.getTx(txIdHex);

        // DEV_NOTE: We can thicken these tests to ensure that the transactions were transformed correctly.
        expect(dbTransaction, `Should have all transactions for any given block (block ${mockedBlock.blockHeight}), tx ${encodeHex(transaction.txHash)}`).toEqual(expect.anything());
        expect(dbTransaction.blockHeight, `Should link the transaction to the right block(block ${mockedBlock.blockHeight}), tx ${transaction.txId}`).toBe(mockedBlock.blockHeight.toString());
      }
    }

    // Signal transition of 'Db Building status'
    const dbBuildingStatus = await db.getDBBuildingStatus();
    expect(dbBuildingStatus, 'Should have "Done" value for "DB Building Status"').toBe('Done');

    // Signal the last block that was build
    const updatedLastBuiltBlockHeight = await db.getLastBuiltBlockHeight();
    expect(updatedLastBuiltBlockHeight, 'The last-block-built should be the highest existing block').toEqual(highestExistingBlock);
  }

  function expectNothingToHappen() {
    expectDbToNotBeCleared();
    expectDbToNotRebuild();
  }

  async function expectDbVersionToBeSet(expectedDbVersion: number) {
    const dbVersion = await db.getVersion();

    expect(spySetDbVersion, 'Should call "Set Db Version" exactly once').toBeCalledTimes(1);
    expect(spySetDbVersion, 'Should call "Set Db Version" with the right version').toBeCalledWith(expectedDbVersion);
    expect(dbVersion, 'Should have set the given Prism version as the current DB version').toBe(expectedDbVersion);
  }

  describe('When DB is Empty', () => {
    it('Should rebuild the DB when the DB is empty', async () => {
      initSpies();

      const blocks = generateAllBlockHeightsForChainLength(BLOCKCHAIN_LENGTH).map(h => generateRandomGetBlockResponse(BigInt(h)));

      orbsBlocksPolling.setBlockChain(blocks);

      await dbBuilder.init(dbVersionForTest);

      await expectDbVersionToBeSet(dbVersionForTest);
      await expectFullDBBuildFromZero(BLOCKCHAIN_LENGTH, blocks);
    });
  });

  describe('When DB has some blocks', () => {
    /**
     * Signals that there are blocks in the db.
     */
    beforeEach(async () => {
      await fillDbWithBlocks();
    });

    describe('When current DB-Version !== Prism DB-Version', () => {
      it('Should throw an error when current DB-Version > Prism Db-Version', async () => {
        const lowerThanExistingDbVersion = dbVersionForTest - 2;
        let errorCode: TDBBuilderErrorCode;

        initSpies();

        // Ensure error throwing
        await expect(dbBuilder.init(lowerThanExistingDbVersion).catch(e => {
          errorCode = e.code;
          throw e;
        })).rejects.toThrowError(DBBuilderError);

        // Ensure right error code
        expect(errorCode).toBe<TDBBuilderErrorCode>('LowerDbVersion');

        expectNothingToHappen();
      });

      it('Should clear the DB and rebuild from zero when the current DB-Version < Prism DB-Version + update Db-version', async () => {
        const higherThanExistingDbVersion = dbVersionForTest + 2;

        const blocks = generateAllBlockHeightsForChainLength(BLOCKCHAIN_LENGTH).map(h => generateRandomGetBlockResponse(BigInt(h)));

        orbsBlocksPolling.setBlockChain(blocks);

        initSpies();
        await dbBuilder.init(higherThanExistingDbVersion);

        expectDbToBeCleared();
        await expectDbVersionToBeSet(higherThanExistingDbVersion);
        await expectFullDBBuildFromZero(BLOCKCHAIN_LENGTH, blocks);
      });
    });

    describe('When current DB-Version === Prism DB-Version', () => {
      it ('Should do nothing when "Db Building status" == "Done"', async () => {
        await db.setDBBuildingStatus('Done');

        initSpies();
        await dbBuilder.init(dbVersionForTest);

        expectNothingToHappen();
      });

      it ('Should build from zero when "Db Building status" == "None"', async () => {
        await db.setDBBuildingStatus('HasNotStarted');

        const blocks = generateAllBlockHeightsForChainLength(BLOCKCHAIN_LENGTH).map(h => generateRandomGetBlockResponse(BigInt(h)));

        orbsBlocksPolling.setBlockChain(blocks);

        initSpies();
        await dbBuilder.init(dbVersionForTest);

        await expectFullDBBuildFromZero(BLOCKCHAIN_LENGTH, blocks);
      });

      it ('Should build from last built block when "Db Building status" == "In Work"', async () => {
        await db.setDBBuildingStatus('InWork');

        const existingBlocksInChain = 300;
        const lastBuiltBlock = 120;
        const blocks = generateAllBlockHeightsForChainLength(existingBlocksInChain).map(h => generateRandomGetBlockResponse(BigInt(h)));

        orbsBlocksPolling.setBlockChain(blocks);
        await db.setLastBuiltBlockHeight(lastBuiltBlock);

        initSpies();
        await dbBuilder.init(dbVersionForTest);

        await expectFullDBBuildFromPreviousPoint(existingBlocksInChain, lastBuiltBlock, blocks);
      });
    });
  });

  describe('Validity checks', () => {
    it ('Should throw an error when there are block AND DB-Version == Prism-version AND "Db Building status" == Unknown value', async () => {

      // Signal that there are some blocks in the DB
      await fillDbWithBlocks();

      // @ts-ignore (Intentionally for the test's sake)
      await db.setDBBuildingStatus('NonExistingValue');

      await expect(dbBuilder.init(dbVersionForTest)).rejects.toThrow();
    });
  });
});

function generateAllBlockHeightsForChainLength(chainLength: number) {
  return [...Array(chainLength).keys()].map(h => h + 1); // Blocks start from 1
}
