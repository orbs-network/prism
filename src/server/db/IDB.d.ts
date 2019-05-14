/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';
import { ICompoundTxIdx } from '../../shared/ICompoundTxIdx';
import { IRawBlock } from '../orbs-adapter/IRawData';

export interface IDB {
  init(): Promise<void>;
  destroy(): Promise<void>;
  clearAll(): Promise<void>;
  storeBlock(block: IBlock): Promise<void>;
  storeTxes(txes: ITx[]): Promise<void>;
  getLatestBlocks(count: number): Promise<IBlock[]>;
  getBlockByHash(blockHash: string): Promise<IBlock>;
  getBlockByHeight(blockHeight: string): Promise<IBlock>;
  getLatestBlockHeight(): Promise<bigint>;
  getHeighestConsecutiveBlockHeight(): Promise<bigint>;
  setHeighestConsecutiveBlockHeight(value: bigint): Promise<void>;
  getTxById(txId: string): Promise<ITx>;
  getDeployContractTx(contractName: string, lang: number): Promise<ITx>;
  getContractTxes(contractName: string, vector: number, compoundTxIdx?: ICompoundTxIdx): Promise<ITx[]>;
}
