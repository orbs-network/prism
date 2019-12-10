/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IBlock } from '../../shared/IBlock';
import { IShortTx, IContractGist } from '../../shared/IContractData';
import { ITx } from '../../shared/ITx';
import { txToShortTx } from '../transformers/txTransform';
import {IDB, TDBBuildingStatus, TDBFillingMethod} from './IDB';

interface IDBConstructionStateInMemory {
  dbFillingMethod: TDBFillingMethod;
  dbBuildingStatus: TDBBuildingStatus;
  lastBuiltBlockHeight: number;
}

const defaultDbConstructionState: IDBConstructionStateInMemory = Object.freeze({
  dbBuildingStatus: 'None',
  dbFillingMethod: 'None',
  lastBuiltBlockHeight: 0,
});

export class InMemoryDB implements IDB {
  private blocks: Map<string, IBlock>;
  private txes: Map<string, ITx>;
  private heighestConsecutiveBlockHeight: bigint = 0n;
  private dbVersion: string = '0.0.0';
  private dbConstructionState: IDBConstructionStateInMemory = Object.assign({}, defaultDbConstructionState);

  constructor(private readOnlyMode: boolean = false) {}

  public async init(): Promise<void> {
    this.blocks = new Map();
    this.txes = new Map();
  }

  public async destroy(): Promise<void> {
    // nothing to destroy...
  }

  public async getVersion(): Promise<string> {
    return this.dbVersion;
  }
  public async setVersion(version: string): Promise<void> {
    if (this.readOnlyMode) {
      return;
    }

    this.dbVersion = version;
  }

  public async getDBFillingMethod(): Promise<TDBFillingMethod> {
    return this.dbConstructionState.dbFillingMethod;
  }

  public async setDBFillingMethod(dbFillingMethod: TDBFillingMethod): Promise<void> {
    if (this.readOnlyMode) {
      return ;
    }

    this.dbConstructionState.dbFillingMethod = dbFillingMethod;
  }

  public async getDBBuildingStatus(): Promise<TDBBuildingStatus> {
    return this.dbConstructionState.dbBuildingStatus;
  }

  public async setDBBuildingStatus(dbBuildingStatus: TDBBuildingStatus): Promise<void> {
    if (this.readOnlyMode) {
      return ;
    }

    this.dbConstructionState.dbBuildingStatus = dbBuildingStatus;
  }

  public async getLastBuiltBlockHeight(): Promise<number> {
    return this.dbConstructionState.lastBuiltBlockHeight;
  }

  public async setLastBuiltBlockHeight(lastBuiltBlockHeight: number): Promise<void> {
    if (this.readOnlyMode) {
      return ;
    }

    this.dbConstructionState.lastBuiltBlockHeight = lastBuiltBlockHeight;
  }

  public async clearAll(): Promise<void> {
    if (this.readOnlyMode) {
      return;
    }
    this.blocks = new Map();
    this.txes = new Map();
    this.heighestConsecutiveBlockHeight = 0n;
    this.dbConstructionState = Object.assign({}, defaultDbConstructionState);
  }

  public async storeBlock(block: IBlock): Promise<void> {
    if (this.readOnlyMode) {
      return;
    }
    this.blocks.set(block.blockHash, block);
    this.capBlocks();
  }

  public async storeTxes(txes: ITx[]): Promise<void> {
    if (this.readOnlyMode) {
      return;
    }
    txes.map(tx => this.txes.set(tx.txId.toLowerCase(), tx));
    this.capTxes();
  }

  public async getLatestBlocks(count: number): Promise<IBlock[]> {
    const blocksArr = Array.from(this.blocks);
    return blocksArr
      .map(item => item[1])
      .sort((a, b) => b.blockTimestamp - a.blockTimestamp)
      .filter((_, idx) => idx < count);
  }

  public async getBlockByHeight(blockHeight: string): Promise<IBlock> {
    for (const block of this.blocks.values()) {
      if (block.blockHeight === blockHeight) {
        return block;
      }
    }
    return null;
  }

  public async getHeighestConsecutiveBlockHeight(): Promise<bigint> {
    return this.heighestConsecutiveBlockHeight;
  }

  public async setHeighestConsecutiveBlockHeight(value: bigint): Promise<void> {
    if (this.readOnlyMode) {
      return;
    }
    this.heighestConsecutiveBlockHeight = value;
  }

  public async getBlockByHash(blockHash: string): Promise<IBlock> {
    return this.blocks.get(blockHash) || null;
  }

  public async getLatestBlockHeight(): Promise<bigint> {
    let result: bigint = 0n;
    for (const block of this.blocks.values()) {
      const currentBlockHeight = BigInt(block.blockHeight);
      if (currentBlockHeight > result) {
        result = currentBlockHeight;
      }
    }

    return result;
  }

  public async getTxById(txId: string): Promise<ITx> {
    return this.txes.get(txId.toLowerCase()) || null;
  }

  public async getDeployedContracts(): Promise<IContractGist[]> {
    const result: IContractGist[] = [];
    for (const tx of this.txes.values()) {
      if (tx.contractName === '_Deployments' && tx.methodName === 'deployService' && tx.executionResult === 'SUCCESS') {
        const { inputArguments: args } = tx;
        if (args.length >= 3 && args[0].type === 'string' && args[1].type === 'uint32') {
          const contractGist: IContractGist = {
            contractName: args[0].value,
            txId: tx.txId,
            deployedBy: tx.signerAddress,
          }
          result.push(contractGist);
        }
      }
    }
    return result;
  }

  public async getDeployContractTx(contractName: string, ignoreCase?: boolean): Promise<ITx> {
    if (ignoreCase === true) {
      contractName = contractName.toLowerCase();
    }
    for (const tx of this.txes.values()) {
      if (tx.contractName === '_Deployments' && tx.methodName === 'deployService' && tx.executionResult === 'SUCCESS') {
        const { inputArguments: args } = tx;
        if (args.length >= 3) {
          if (args[0].type === 'string' && args[1].type === 'uint32') {
            const argContractName = ignoreCase ? args[0].value.toLowerCase() : args[0].value;
            if (argContractName === contractName) {
              return tx;
            }
          }
        }
      }
    }
  }

  public async getBlockTxes(blockHeight: bigint): Promise<ITx[]> {
    const txArr = Array.from(this.txes);
    return txArr.map(item => item[1]).filter(tx => tx.blockHeight === blockHeight.toString());
  }

  public async getContractTxes(
    contractName: string,
    limit: number,
    startFromExecutionIdx?: number,
  ): Promise<IShortTx[]> {
    let allTxes = Array.from(this.txes)
      .map(mapItem => mapItem[1])
      .filter(tx => tx.contractName === contractName)
      .sort((a, b) => Number(BigInt(b.blockHeight) - BigInt(a.blockHeight)) || b.idxInBlock - a.idxInBlock);

    const lastExecutionIdx = allTxes.length - 1;
    if (startFromExecutionIdx === undefined) {
      startFromExecutionIdx = lastExecutionIdx;
    } else {
      startFromExecutionIdx = Math.max(0, Math.min(startFromExecutionIdx, lastExecutionIdx));
      allTxes = allTxes.slice(lastExecutionIdx - startFromExecutionIdx);
    }

    return allTxes.splice(0, limit).map((tx, idx) => txToShortTx(tx, startFromExecutionIdx - idx + 1));
  }

  private capTxes(): void {
    if (this.txes.size > 1100) {
      const txArr = Array.from(this.txes);
      this.txes.clear();
      txArr
        .map(item => item[1])
        .sort((a, b) => a.timestamp - b.timestamp)
        .filter((_, idx) => idx < 1000)
        .forEach(tx => this.txes.set(tx.txId.toLowerCase(), tx));
    }
  }

  private capBlocks(): void {
    if (this.blocks.size > 1100) {
      const blocksArr = Array.from(this.blocks);
      this.blocks.clear();
      blocksArr
        .map(item => item[1])
        .sort((a, b) => a.blockTimestamp - b.blockTimestamp)
        .filter((_, idx) => idx < 1000)
        .forEach(block => this.blocks.set(block.blockHash, block));
    }
  }
}
