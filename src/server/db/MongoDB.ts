/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import * as mongoose from 'mongoose';
import { IBlock } from '../../shared/IBlock';
import { IRawTx } from '../../shared/IRawData';
import { IDB } from './IDB';
import * as mongooseLong from 'mongoose-long';
import * as winston from 'winston';

mongooseLong(mongoose);
mongoose.set('useFindAndModify', false);

interface ICacheDocument extends mongoose.Document {
  _id: number;
  heighestConsecutiveBlockHeight: bigint;
}

const cacheSchema = new mongoose.Schema({
  _id: Number,
  heighestConsecutiveBlockHeight: (mongoose.Schema.Types as any).Long,
});

const blockSchema = new mongoose.Schema({
  blockHash: String,
  blockHeight: (mongoose.Schema.Types as any).Long,
  blockTimestamp: Number,
  txIds: [String],
});
blockSchema.index({ blockHash: 'text' });

const txSchema = new mongoose.Schema({
  txId: String,
  blockHeight: String,
  protocolVersion: Number,
  virtualChainId: Number,
  timestamp: Number,
  signerPublicKey: String,
  signerAddress: String,
  contractName: String,
  methodName: String,
  inputArguments: Array,
  executionResult: String,
  outputArguments: Array,
  outputEvents: Array,
});
txSchema.index({ txId: 'text' });

export class MongoDB implements IDB {
  private db: mongoose.Mongoose;
  private BlockModel: mongoose.Model<mongoose.Document>;
  private TxModel: mongoose.Model<mongoose.Document>;
  private CacheModel: mongoose.Model<ICacheDocument>;

  constructor(private logger: winston.Logger, private connectionUrl: string, private readOnlyMode: boolean = false) {}

  public init(): Promise<void> {
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connecting', () => this.logger.info('mongoose connecting'));
      mongoose.connection.once('connected', () => this.logger.info('mongoose conncted'));
      mongoose.connection.once('disconnecting', () => this.logger.info('mongoose disconnecting'));
      mongoose.connection.once('disconnected', () => this.logger.info('mongoose disconnected'));

      mongoose.connection.once('error', reject);

      mongoose.connect(this.connectionUrl, { useNewUrlParser: true }).then(db => {
        console.log('connect completed');
        this.db = db;

        // model
        this.BlockModel = mongoose.model('Block', blockSchema);
        this.TxModel = mongoose.model('Tx', txSchema);
        this.CacheModel = mongoose.model('Cache', cacheSchema);
        resolve();
      });
    });
  }

  public async destroy() {
    if (this.db) {
      await this.db.disconnect();
      this.db = null;
    }
  }

  public async clearAll(): Promise<void> {
    if (this.readOnlyMode) {
      return;
    }
    await this.BlockModel.remove({});
    await this.TxModel.remove({});
    await this.CacheModel.remove({});
  }

  public async storeBlock(block: IBlock): Promise<void> {
    if (this.readOnlyMode) {
      return;
    }
    const startTime = Date.now();
    this.logger.info(`Storing block #${block.blockHeight}`);
    const blockInstance = new this.BlockModel(block);
    await blockInstance.save();
    this.logger.info(`block stored [${Date.now() - startTime}ms.]`);
  }

  public async getLatestBlocks(count: number): Promise<IBlock[]> {
    const startTime = Date.now();
    this.logger.info(`Quering for the latest ${count} blocks`);
    const result = await this.BlockModel.find({}, { _id: false, __v: false })
      .sort('-blockHeight')
      .limit(count)
      .lean()
      .exec();

    if (result) {
      this.logger.info(`${count} blocks found [${Date.now() - startTime}ms.]`);
      // in the db we store the blockHeight as long (For better search), here we convert it back to string
      result.forEach(block => (block.blockHeight = block.blockHeight.toString()));
      return result;
    } else {
      this.logger.info(`no blocks found [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  public async getBlockByHash(blockHash: string): Promise<IBlock> {
    const startTime = Date.now();
    this.logger.info(`Searching for block by hash: ${blockHash}`);
    const result = await this.BlockModel.findOne({ $text: { $search: blockHash } }, { _id: false, __v: false })
      .lean()
      .exec();

    if (result) {
      this.logger.info(`block found [${Date.now() - startTime}ms.]`);
      // in the db we store the blockHeight as long (For better search), here we convert it back to string
      result.blockHeight = result.blockHeight.toString();
      return result;
    } else {
      this.logger.info(`block not found [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  public async getBlockByHeight(blockHeight: string): Promise<IBlock> {
    const startTime = Date.now();
    this.logger.info(`Searching for block by height: ${blockHeight}`);
    const result = await this.BlockModel.findOne({ blockHeight }, { _id: false, __v: false })
      .lean()
      .exec();

    if (result) {
      this.logger.info(`block found [${Date.now() - startTime}ms.]`);
      // in the db we store the blockHeight as long (For better search), here we convert it back to string
      result.blockHeight = result.blockHeight.toString();
      return result;
    } else {
      this.logger.info(`block not found [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  public async getHeighestConsecutiveBlockHeight(): Promise<bigint> {
    const result = await this.CacheModel.findOne({ _id: 1 });
    if (result) {
      return BigInt(result.heighestConsecutiveBlockHeight);
    }

    return 0n;
  }

  public async setHeighestConsecutiveBlockHeight(value: bigint): Promise<void> {
    if (this.readOnlyMode) {
      return;
    }
    await this.CacheModel.findOneAndUpdate(
      { _id: 1 },
      { _id: 1, heighestConsecutiveBlockHeight: value },
      { upsert: true },
    );
  }

  public async getLatestBlockHeight(): Promise<bigint> {
    const result = await this.BlockModel.findOne()
      .sort('-blockHeight')
      .lean()
      .exec();

    if (result) {
      return BigInt(result.blockHeight);
    }

    return 0n;
  }

  public async storeTx(tx: IRawTx | IRawTx[]): Promise<any> {
    if (this.readOnlyMode) {
      return;
    }
    if (Array.isArray(tx)) {
      return Promise.all(tx.map(t => this.storeTx(t)));
    } else {
      const txInstance = new this.TxModel(tx);
      await txInstance.save();
    }
  }

  public async getTxById(txId: string): Promise<IRawTx> {
    const startTime = Date.now();
    this.logger.info(`Searching for tx by txId: ${txId}`);
    const result = await this.TxModel.findOne({ $text: { $search: txId } }, { _id: false, __v: false })
      .lean()
      .exec();

    this.logger.info(`tx found [${Date.now() - startTime}ms.]`);
    return result;
  }
}
