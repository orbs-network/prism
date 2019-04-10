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
import winston = require('winston');
import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';

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
    if (!this.initScheduler()) {
      throw new Error(`Unable to initialize OrbsAdapter`);
    }
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
    const getBlockResponse = await this.getBlockWrapper(height);
    if (getBlockResponse) {
      if (getBlockResponse.requestStatus === 'COMPLETED') {
        return blockResponseToRawBlock(getBlockResponse);
      } else {
        this.logger.error(`OrbsClient responded with bad requestStatus`, {
          method: 'getBlockAt',
          requestStatus: getBlockResponse.requestStatus,
        });
      }
    }

    return null;
  }

  private async checkForNewBlocks(): Promise<void> {
    try {
      const nextHeight = this.latestKnownHeight + 1n;
      this.logger.info(`get block at => ${nextHeight}`);
      const getBlockResponse = await this.getBlockWrapper(nextHeight);
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
      const getBlockResponse = await this.orbsClient.getBlock(0n);

      if (typeof getBlockResponse.blockHeight !== 'bigint') {
        this.logger.crit(`orbsClient.getBlock(0n) returned with bad blockHeight`, {
          method: 'initScheduler',
          blockHeight: getBlockResponse.blockHeight,
        });
        return false;
      }

      // blockHeight = 0n can happen if there was some error in the response
      // because we expect orbs to have at least one block it is not reasonable to get block height = 0
      if (getBlockResponse.blockHeight === 0n) {
        this.logger.crit(`orbsClient.getBlock(0n) returned blockHeight = 0n, not reasonable`, {
          method: 'initScheduler',
        });
        return false;
      }

      this.latestKnownHeight = getBlockResponse.blockHeight;
      this.logger.info(`Lastest height is ${this.latestKnownHeight}`);
    }

    this.schedualNextRequest();
    return true;
  }

  private async getBlockWrapper(blockHeight: bigint): Promise<GetBlockResponse> {
    let getBlockResponse: GetBlockResponse;
    try {
      getBlockResponse = await this.orbsClient.getBlock(blockHeight);
    } catch (err) {
      this.logger.error(`getBlock failed`, { method: 'getBlockWrapper', err });
      return null;
    }

    return getBlockResponse;
  }

  private schedualNextRequest(): void {
    this.timeoutId = setTimeout(() => this.checkForNewBlocks(), this.poolingInterval);
  }
}
