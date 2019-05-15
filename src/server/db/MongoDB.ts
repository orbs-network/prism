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

const txSchema = new mongoose.Schema({
  idxInBlock: Number,
  txId: String,
  blockHeight: (mongoose.Schema.Types as any).Long,
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

const blockHeighToBigInt = <T>(obj: T & { blockHeight: string }): T & { blockHeight: bigint } => ({
  ...obj,
  blockHeight: BigInt(obj.blockHeight),
});
const blockHeighToString = <T>(obj: T & { blockHeight: bigint }): T & { blockHeight: string } => ({
  ...obj,
  blockHeight: obj.blockHeight.toString(),
});

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
        this.db = db;

        txSchema.index({ txId: 'text' });
        blockSchema.index({ blockHash: 'text' });

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
    const blockInstance = new this.BlockModel(blockHeighToBigInt(block));
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
      return result.map(blockHeighToString);
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
      return blockHeighToString<IBlock>(result);
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
      return blockHeighToString<IBlock>(result);
    } else {
      this.logger.info(`block not found [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  public async getDeployContractTx(contractName: string, lang: number): Promise<IRawTx> {
    const startTime = Date.now();
    this.logger.info(`Searching for deployment of contract: ${contractName}`);
    const result = await this.TxModel.findOne(
      {
        contractName: '_Deployments',
        methodName: 'deployService',
        executionResult: 'SUCCESS',
        'inputArguments.0.value': contractName,
        'inputArguments.1.value': lang.toString(),
      },
      { _id: false, __v: false },
    )
      .lean()
      .exec();

    if (result) {
      this.logger.info(`contract found [${Date.now() - startTime}ms.]`);
      return blockHeighToString<IRawTx>(result);
    } else {
      this.logger.info(`contract not found [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  public async getContractTxes(contractName: string, limit: number, startFromBlockHeight: bigint): Promise<IRawTx[]> {
    const startTime = Date.now();
    this.logger.info(`Searching for all txes for contract: ${contractName}`);
    const conditions: any = {
      contractName,
    };

    if (startFromBlockHeight > 0n) {
      conditions.blockHeight = { $lte: startFromBlockHeight };
    }

    const result = await this.TxModel.find(
      conditions,
      { _id: false, __v: false },
      {
        skip: 0,
        sort: {
          blockHeight: -1,
          idxInBlock: -1,
        },
        limit,
      },
    )
      .lean()
      .exec();

    if (result) {
      this.logger.info(`found ${result.length} txes for contract ${contractName} in [${Date.now() - startTime}ms.]`);
      return result.map(blockHeighToString);
    } else {
      this.logger.info(`no txes found for contract ${contractName} [${Date.now() - startTime}ms.]`);
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

  public async storeTxes(txes: IRawTx[]): Promise<any> {
    if (this.readOnlyMode) {
      return;
    }
    return Promise.all(
      txes.map(async t => {
        const txInstance = new this.TxModel(blockHeighToBigInt(t));
        await txInstance.save();
      }),
    );
  }

  public async getTxById(txId: string): Promise<IRawTx> {
    const startTime = Date.now();
    this.logger.info(`Searching for tx by txId: ${txId}`);
    const result = await this.TxModel.findOne({ $text: { $search: txId } }, { _id: false, __v: false })
      .lean()
      .exec();

    this.logger.info(`tx found [${Date.now() - startTime}ms.]`);

    return result ? blockHeighToString(result) : result;
  }
}
