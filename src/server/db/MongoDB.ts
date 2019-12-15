/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import * as mongoose from 'mongoose';
import * as mongooseLong from 'mongoose-long';
import * as winston from 'winston';
import { IBlock } from '../../shared/IBlock';
import { IShortTx, IContractGist } from '../../shared/IContractData';
import { ITx } from '../../shared/ITx';
import { txToShortTx } from '../transformers/txTransform';
import { IDB } from './IDB';

mongooseLong(mongoose);
mongoose.set('useFindAndModify', false);

interface ICacheDocument extends mongoose.Document {
  _id: number;
  heighestConsecutiveBlockHeight: bigint;
  dbVersion: string;
}

const cacheSchema = new mongoose.Schema({
  _id: Number,
  heighestConsecutiveBlockHeight: (mongoose.Schema.Types as any).Long,
  dbVersion: String,
});

const blockSchema = new mongoose.Schema({
  blockHash: String,
  blockHeight: (mongoose.Schema.Types as any).Long,
  blockTimestamp: Number,
  txIds: [String],
});

const txSchema = new mongoose.Schema({
  txId: String,
  idxInBlock: Number,
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
const blockHeightToString = <T>(obj: T & { blockHeight: bigint }): T & { blockHeight: string } => ({
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

  public async getVersion(): Promise<string> {
    const result = await this.CacheModel.findOne({ _id: 1 });
    if (result && result.dbVersion !== undefined) {
      return result.dbVersion;
    }

    return '0.0.0';
  }

  public async setVersion(dbVersion: string): Promise<void> {
    if (this.readOnlyMode) {
      return;
    }
    await this.CacheModel.updateOne({ _id: 1 }, { $set: { dbVersion } }, { upsert: true });
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
    this.logger.info(`block ${block.blockHeight} stored [${Date.now() - startTime}ms.]`);
  }

  public async storeTxes(txes: ITx[]): Promise<any> {
    if (this.readOnlyMode) {
      return;
    }
    return Promise.all(txes.map(async tx => await this.storeTx(tx)));
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
      return result.map(blockHeightToString);
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
      return blockHeightToString<IBlock>(result);
    } else {
      this.logger.info(`block not found [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  public async getBlockByHeight(blockHeight: string): Promise<IBlock> {
    const blockHeightAsNumber = parseInt(blockHeight);
    if (Number.isNaN(blockHeightAsNumber)) {
      return null;
    }
    const startTime = Date.now();
    this.logger.info(`Searching for block by height: ${blockHeightAsNumber}`);
    const result = await this.BlockModel.findOne({ blockHeight: blockHeightAsNumber }, { _id: false, __v: false })
      .lean()
      .exec();

    if (result) {
      this.logger.info(`block found [${Date.now() - startTime}ms.]`);
      return blockHeightToString<IBlock>(result);
    } else {
      this.logger.info(`block not found [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  public async getDeployedContracts(): Promise<IContractGist[]> {
    const startTime = Date.now();
    this.logger.info(`Searching for all deployed contracts`);
    const result = await this.TxModel.find(
      {
        contractName: '_Deployments',
        methodName: 'deployService',
        executionResult: 'SUCCESS',
      },
      { _id: false, inputArguments: true, signerAddress: true, txId: true },
    )
      .lean()
      .exec();

    if (result) {
      this.logger.info(`${result.length} contracts found [${Date.now() - startTime}ms.]`);
      return result.map(row => {
        const contractGit: IContractGist = {
          contractName: row.inputArguments[0].value,
          deployedBy: row.signerAddress,
          txId: row.txId,
        };
        return contractGit;
      });
    } else {
      this.logger.info(`No deployed contracts found`);
      return [];
    }
  }

  public async getDeployContractTx(contractName: string, ignoreCase?: boolean): Promise<ITx> {
    const startTime = Date.now();
    this.logger.info(`Searching for deployment of contract: ${contractName}`);

    const searchQuery: string | RegExp = ignoreCase === true ? new RegExp(`^${contractName}$`, 'i') : contractName;
    const result = await this.TxModel.findOne(
      {
        contractName: '_Deployments',
        methodName: 'deployService',
        executionResult: 'SUCCESS',
        'inputArguments.0.value': searchQuery,
      },
      { _id: false, __v: false },
    )
      .lean()
      .exec();

    if (result) {
      this.logger.info(`contract found [${Date.now() - startTime}ms.]`);
      return blockHeightToString<ITx>(result);
    } else {
      this.logger.info(`contract not found [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  public async getContractTxes(
    contractName: string,
    limit: number,
    startFromExecutionIdx?: number,
  ): Promise<IShortTx[]> {
    const startTime = Date.now();
    this.logger.info(`Searching for all txes for contract: ${contractName}`);

    let skip = 0;
    const count = await this.TxModel.count({ contractName });
    const lastExecutionIdx = count - 1;
    if (startFromExecutionIdx === undefined) {
      startFromExecutionIdx = lastExecutionIdx;
    } else {
      startFromExecutionIdx = Math.max(0, Math.min(startFromExecutionIdx, lastExecutionIdx));
      skip = lastExecutionIdx - startFromExecutionIdx;
    }

    const rows = await this.TxModel.find({ contractName }, { _id: false, __v: false })
      .sort({
        blockHeight: -1,
        idxInBlock: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    if (rows) {
      this.logger.info(`found ${rows.length} txes for contract ${contractName} in [${Date.now() - startTime}ms.]`);
      return rows.map((tx, idx) => txToShortTx(tx, startFromExecutionIdx - idx + 1));
    } else {
      this.logger.info(`no txes found for contract ${contractName} [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  public async getHeighestConsecutiveBlockHeight(): Promise<bigint> {
    const result = await this.CacheModel.findOne({ _id: 1 });
    if (result && result.heighestConsecutiveBlockHeight !== undefined) {
      return BigInt(result.heighestConsecutiveBlockHeight);
    }

    return 0n;
  }

  public async setHeighestConsecutiveBlockHeight(value: bigint): Promise<void> {
    if (this.readOnlyMode) {
      return;
    }
    await this.CacheModel.updateOne({ _id: 1 }, { $set: { heighestConsecutiveBlockHeight: value } }, { upsert: true });
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

  public async getBlockTxes(blockHeight: bigint): Promise<ITx[]> {
    const startTime = Date.now();
    const result = await this.TxModel.find(
      { blockHeight },
      { _id: false, __v: false },
      {
        sort: {
          idxInBlock: -1,
        },
      },
    )
      .lean()
      .exec();

    if (result) {
      this.logger.info(`found ${result.length} txes on block ${blockHeight} in [${Date.now() - startTime}ms.]`);
      return result.map(blockHeightToString);
    } else {
      this.logger.info(`no txes found on block ${blockHeight} [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  public async getTxById(txId: string): Promise<ITx> {
    const startTime = Date.now();
    this.logger.info(`Searching for tx by txId: ${txId}`);
    const result = await this.TxModel.findOne({ $text: { $search: txId } }, { _id: false, __v: false })
      .lean()
      .exec();

    if (result) {
      this.logger.info(`tx found [${Date.now() - startTime}ms.]`);
      return blockHeightToString(result);
    } else {
      this.logger.info(`tx not found [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  private async storeTx(tx: ITx): Promise<void> {
    const txInstance = new this.TxModel(blockHeighToBigInt(tx));
    await txInstance.save();
  }
}
