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

export type TDBBuildingStatus = 'Done' | 'InWork' | 'HasNotStarted';

// DEV_NOTE : IMPORTANT : We should increase this version value any time we have breaking changes in the DB content.
export const CURRENT_DB_VERSION = 1;

export interface IDB {
  init(): Promise<void>;
  getVersion(): Promise<number>;
  setVersion(version: number): Promise<void>;
  getDBBuildingStatus(): Promise<TDBBuildingStatus>;
  setDBBuildingStatus(dbBuildingStatus: TDBBuildingStatus): Promise<void>;
  getLastBuiltBlockHeight(): Promise<number>;
  setLastBuiltBlockHeight(lastBuiltBlockHeight: number): Promise<void>;

  destroy(): Promise<void>;
  clearAll(): Promise<void>;
  storeBlock(block: IBlock): Promise<void>;
  storeTxes(txes: ITx[]): Promise<void>;
  getLatestBlocks(count: number): Promise<IBlock[]>;
  getBlockByHash(blockHash: string): Promise<IBlock>;
  getBlockByHeight(blockHeight: string): Promise<IBlock>;
  getLatestBlockHeight(): Promise<bigint>;
  getHighestConsecutiveBlockHeight(): Promise<bigint>;
  setHighestConsecutiveBlockHeight(value: bigint): Promise<void>;
  getTxById(txId: string): Promise<ITx>;
  getDeployContractTx(contractName: string, ignoreCase?: boolean): Promise<ITx>;
  getDeployedContracts(): Promise<IContractGist[]>;
  getBlockTxes(blockHeight: bigint): Promise<ITx[]>;
  getContractTxes(contractName: string, limit: number, executionIdx?: number): Promise<IShortTx[]>;
}
