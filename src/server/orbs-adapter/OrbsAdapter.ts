/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { blockResponseToRawBlock } from '../block-transform/blockTransform';
import { IOrbsClient } from '../orbs-client/IOrbsClient';
import { IRawBlock } from '../../shared/IRawData';
import * as winston from 'winston';
import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { sleep } from '../gaps-filler/Cron';

export type NewBlockCallback = (block: IRawBlock) => void;

export interface INewBlocksHandler {
  handleNewBlock(block: IRawBlock): Promise<void>;
}

export class OrbsAdapter {
  private latestKnownHeight: bigint = BigInt(0);
  private listeners: Map<INewBlocksHandler, INewBlocksHandler> = new Map();
  private timeoutId: NodeJS.Timeout;

  constructor(private logger: winston.Logger, private orbsClient: IOrbsClient, private poolingInterval: number) {}

  public async init(): Promise<void> {
    this.logger.info('initializing the scheduler');
    let schedulerInitialized = false;
    while (!schedulerInitialized) {
      schedulerInitialized = await this.initScheduler();
      if (!schedulerInitialized) {
        this.logger.warn('Unable to initialize the scheduler, retrying in 1sec.');
        await sleep(1000);
      }
    }
    this.logger.info('scheduler initialized');
  }

  public RegisterToNewBlocks(handler: INewBlocksHandler): void {
    this.listeners.set(handler, handler);
  }

  public UnregisterFromNewBlocks(handler: INewBlocksHandler): void {
    this.listeners.delete(handler);
  }

  public dispose(): void {
    this.listeners = new Map();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  public async getBlockAt(height: bigint): Promise<IRawBlock> {
    const getBlockResponse = await this.getBlockWrapper(height, 'getBlockAt');
    if (getBlockResponse) {
      if (getBlockResponse.requestStatus === 'COMPLETED') {
        if (getBlockResponse.blockHeight === 0n) {
          this.logger.error(
            'OrbsClient responded with requestStatus===completed, but blockheight===0, requested block was: ' +
              height.toString(),
          );
        }
        return blockResponseToRawBlock(getBlockResponse);
      } else {
        this.logger.error(`OrbsClient responded with bad requestStatus`, {
          func: 'getBlockAt',
          requestStatus: getBlockResponse.requestStatus,
          requestedBlockHeight: height.toString(),
        });
      }
    }

    return null;
  }

  private async checkForNewBlocks(): Promise<void> {
    try {
      const nextHeight = this.latestKnownHeight + 1n;
      this.logger.info(`get block at => ${nextHeight}`);
      const getBlockResponse = await this.getBlockWrapper(nextHeight, 'checkForNewBlocks');
      if (getBlockResponse) {
        const blockHeight: bigint = BigInt(getBlockResponse.blockHeight);
        this.logger.info(`block height <= ${blockHeight}`);

        if (blockHeight > this.latestKnownHeight) {
          this.listeners.forEach(handler => handler.handleNewBlock(blockResponseToRawBlock(getBlockResponse)));
          this.latestKnownHeight = blockHeight;
        }
      } else {
        this.logger.info(`bad response, ignoring`);
      }
    } catch (err) {
      this.logger.error(`checkForNewBlocks failed`, err);
    }
    this.schedualNextRequest();
  }

  private async initScheduler(): Promise<boolean> {
    if (this.latestKnownHeight === 0n) {
      this.logger.info(`Asking Orbs for the lastest height`);
      let getBlockResponse: GetBlockResponse;
      try {
        getBlockResponse = await this.orbsClient.getBlock(0n);
      } catch (err) {
        this.logger.error('getBlock failed', { func: 'initScheduler', err });
        return false;
      }

      if (typeof getBlockResponse.blockHeight !== 'bigint') {
        this.logger.crit(`orbsClient.getBlock(0n) returned with bad blockHeight`, {
          func: 'initScheduler',
          blockHeight: getBlockResponse.blockHeight,
        });
        return false;
      }

      // blockHeight = 0n can happen if there was some error in the response
      // because we expect orbs to have at least one block it is not reasonable to get block height = 0
      if (getBlockResponse.blockHeight === 0n) {
        this.logger.crit(`orbsClient.getBlock(0n) returned blockHeight = 0n, not reasonable`, {
          func: 'initScheduler',
        });
        return false;
      }

      this.latestKnownHeight = getBlockResponse.blockHeight;
      this.logger.info(`Lastest height is ${this.latestKnownHeight}`);
    }

    this.schedualNextRequest();
    return true;
  }

  private async getBlockWrapper(blockHeight: bigint, sourceMethod: string): Promise<GetBlockResponse> {
    let getBlockResponse: GetBlockResponse;
    try {
      getBlockResponse = await this.orbsClient.getBlock(blockHeight);
    } catch (err) {
      this.logger.error(`getBlock failed`, {
        func: 'getBlockWrapper',
        sourceMethod,
        err,
        errMessage: err.message,
        stack: err.stack,
        blockHeight: blockHeight.toString(),
      });
      return null;
    }

    return getBlockResponse;
  }

  private schedualNextRequest(): void {
    this.timeoutId = setTimeout(() => this.checkForNewBlocks(), this.poolingInterval);
  }
}
