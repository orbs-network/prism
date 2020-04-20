/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { INewBlocksHandler } from 'orbs-blocks-polling-js';
import { decodeHex } from 'orbs-client-sdk';
import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { CONTRACT_TXES_HISTORY_PAGE_SIZE } from '../../shared/Constants';
import { IBlock, IBlockSummary } from '../../shared/IBlock';
import { IContractBlocksInfo, IContractData, IContractGist } from '../../shared/IContractData';
import { ITx } from '../../shared/ITx';
import { ISearchResult } from '../../shared/ISearchResult';
import { IDB } from '../db/IDB';
import { blockResponseToBlock, blockResponseTransactionsToTxs, blockToBlockSummary } from '../transformers/blockTransform';
import {IHealthStatusApiResponse} from '../../shared/apis/metricsApis';
import * as winston from "winston";

export class Storage implements INewBlocksHandler {
  constructor(private db: IDB, private logger: winston.Logger) {}

  public getBlockByHash(blockHash: string): Promise<IBlock> {
    return this.db.getBlockByHash(blockHash);
  }

  public async getLatestBlocksSummary(count: number): Promise<IBlockSummary[]> {
    const latestBlocks = await this.db.getLatestBlocks(count);
    return latestBlocks.map(blockToBlockSummary);
  }

  public getBlockByHeight(blockHeight: string): Promise<IBlock> {
    return this.db.getBlockByHeight(blockHeight);
  }

  public getLatestBlockHeight(): Promise<bigint> {
    return this.db.getLatestBlockHeight();
  }

  public getHighestConsecutiveBlockHeight(): Promise<bigint> {
    return this.db.getHighestConsecutiveBlockHeight();
  }

  public setHighestConsecutiveBlockHeight(value: bigint): Promise<void> {
    return this.db.setHighestConsecutiveBlockHeight(value);
  }

  public getTx(txId: string): Promise<ITx> {
    return this.db.getTxById(txId);
  }

  public async getAllDeployedContracts(): Promise<IContractGist[]> {
    return await this.db.getDeployedContracts();
  }

  public async getContractData(contractName: string, executionIdx?: number): Promise<IContractData> {
    const deployTx = await this.db.getDeployContractTx(contractName);
    let code: string[] = null;
    if (deployTx) {
      code = deployTx.inputArguments.splice(2).map(arg => Buffer.from(decodeHex(arg.value)).toString());
    }
    const txes = await this.db.getContractTxes(contractName, CONTRACT_TXES_HISTORY_PAGE_SIZE, executionIdx);
    const blocksInfo: IContractBlocksInfo = txes.reduce(
      (prev, tx) => {
        if (prev[tx.blockHeight]) {
          prev[tx.blockHeight].txes.push(tx);
        } else {
          prev[tx.blockHeight] = {
            stateDiff: null,
            txes: [tx],
          };
        }
        return prev;
      },
      {} as IContractBlocksInfo,
    );
    return {
      contractName,
      code,
      blocksInfo,
    };
  }

  public async handleNewBlock(getBlockResponse: GetBlockResponse): Promise<void> {
    const block = blockResponseToBlock(getBlockResponse);
    const txes = blockResponseTransactionsToTxs(getBlockResponse);

    try {
      await Promise.all([this.db.storeBlock(block), this.db.storeTxes(txes)]);
    } catch (e) {
      this.logger.error(`Failed handling block ${getBlockResponse.blockHeight} : ${e}`);
      throw e;
    }
  }

  public async search(term: string): Promise<ISearchResult> {
    let block = await this.getBlockByHeight(term);
    if (block) {
      return {
        block,
        type: 'block',
      };
    }

    block = await this.getBlockByHash(term);
    if (block) {
      return {
        block,
        type: 'block',
      };
    }

    const tx = await this.getTx(term);
    if (tx) {
      return {
        tx,
        type: 'tx',
      };
    }

    const deployTx = await this.db.getDeployContractTx(term, true);
    if (deployTx) {
      return {
        contractName: deployTx.inputArguments[0].value,
        type: 'contract',
      };
    }

    return null;
  }

  public async getDiagnostics(): Promise<IHealthStatusApiResponse> {
    const dbVersion = await this.db.getVersion();
    const dbBuildingStatus = await this.db.getDBBuildingStatus();
    const lastBuiltBlock = await this.db.getLastBuiltBlockHeight();
    const latestBlockHeight = Number(await this.db.getLatestBlockHeight());

    return {
      DB: {
        dbVersion,
        dbBuildingStatus,
        lastBuiltBlock,
      },
      ORBS_SYNC: {
        latestBlockHeight,
      },
    };
  }
}
