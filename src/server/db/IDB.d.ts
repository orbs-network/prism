/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IBlock } from '../../shared/IBlock';
import { IRawTx } from '../../shared/IRawData';

export interface ICompoundTxIdx {
  blockHeight?: bigint;
  txIdx?: number;
}

export interface IDB {
  init(): Promise<void>;
  destroy(): Promise<void>;
  clearAll(): Promise<void>;
  storeBlock(block: IBlock): Promise<void>;
  getLatestBlocks(count: number): Promise<IBlock[]>;
  getBlockByHash(blockHash: string): Promise<IBlock>;
  getBlockByHeight(blockHeight: string): Promise<IBlock>;
  getLatestBlockHeight(): Promise<bigint>;
  getHeighestConsecutiveBlockHeight(): Promise<bigint>;
  setHeighestConsecutiveBlockHeight(value: bigint): Promise<void>;
  storeTxes(txes: IRawTx[]): Promise<void>;
  getTxById(txId: string): Promise<IRawTx>;
  getDeployContractTx(contractName: string, lang: number): Promise<IRawTx>;
  getContractTxes(contractName: string, limit: number, compoundTxIdx?: ICompoundTxIdx): Promise<IRawTx[]>;
}
