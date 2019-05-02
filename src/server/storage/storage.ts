/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IBlock, IBlockSummary } from '../../shared/IBlock';
import { ISearchResult } from '../../shared/ISearchResult';
import { IRawTx, IRawBlock } from '../../shared/IRawData';
import { rawBlockToBlock, blockToBlockSummary } from '../transformers/blockTransform';
import { IDB } from '../db/IDB';
import { IContractData, IContractBlockInfo } from '../../shared/IContractData';
import { decodeHex } from 'orbs-client-sdk';
import { txToShortTx } from '../transformers/txTransform';

export class Storage {
  constructor(private db: IDB) {}

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

  public getHeighestConsecutiveBlockHeight(): Promise<bigint> {
    return this.db.getHeighestConsecutiveBlockHeight();
  }

  public setHeighestConsecutiveBlockHeight(value: bigint): Promise<void> {
    return this.db.setHeighestConsecutiveBlockHeight(value);
  }

  public getTx(txId: string): Promise<IRawTx> {
    return this.db.getTxById(txId);
  }

  public async getContractData(contractName: string): Promise<IContractData> {
    const deployTx = await this.db.getDeployContractTx(contractName, 1);
    let code = null;
    if (deployTx) {
      code = Buffer.from(decodeHex(deployTx.inputArguments[2].value)).toString();
    }
    const txes = await this.db.getContractTxes(contractName, 100);
    const blockInfo: IContractBlockInfo = txes.reduce(
      (prev, tx) => {
        if (prev[tx.blockHeight]) {
          prev[tx.blockHeight].txes.push(txToShortTx(tx));
        } else {
          prev[tx.blockHeight] = {
            stateDiff: null,
            txes: [txToShortTx(tx)],
          };
        }
        return prev;
      },
      {} as IContractBlockInfo,
    );
    return {
      contractName,
      code,
      blockInfo,
    };

    return null;
  }

  public async handleNewBlock(rawBlock: IRawBlock): Promise<void> {
    await this.db.storeBlock(rawBlockToBlock(rawBlock));
    await this.db.storeTxes(rawBlock.transactions);
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

    return null;
  }
}
