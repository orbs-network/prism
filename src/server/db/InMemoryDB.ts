/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IDB } from './IDB';
import { IBlock } from '../../shared/IBlock';
import { IRawTx } from '../../shared/IRawData';

export class InMemoryDB implements IDB {
  private blocks: Map<string, IBlock>;
  private txs: Map<string, IRawTx>;
  private heighestConsecutiveBlockHeight: bigint = 0n;

  public async init(): Promise<void> {
    this.blocks = new Map();
    this.txs = new Map();
  }

  public async destroy(): Promise<void> {
    // nothing to destroy...
  }

  public async clearAll(): Promise<void> {
    this.blocks = new Map();
    this.txs = new Map();
    this.heighestConsecutiveBlockHeight = 0n;
  }

  public async storeBlock(block: IBlock): Promise<void> {
    this.blocks.set(block.blockHash, block);
    this.capBlocks();
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

  public async storeTx(tx: IRawTx | IRawTx[]): Promise<void> {
    if (Array.isArray(tx)) {
      tx.map(t => this.txs.set(t.txId.toLowerCase(), t));
    } else {
      this.txs.set(tx.txId.toLowerCase(), tx);
    }
    this.capTxes();
  }

  public async getTxById(txId: string): Promise<IRawTx> {
    return this.txs.get(txId.toLowerCase()) || null;
  }

  private capTxes(): void {
    if (this.txs.size > 1100) {
      const txArr = Array.from(this.txs);
      this.txs.clear();
      txArr
        .map(item => item[1])
        .sort((a, b) => a.timestamp - b.timestamp)
        .filter((_, idx) => idx < 1000)
        .forEach(tx => this.txs.set(tx.txId.toLowerCase(), tx));
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
