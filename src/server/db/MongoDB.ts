import * as mongoose from 'mongoose';
import { IBlock } from '../../shared/IBlock';
import { IRawTx } from '../../shared/IRawData';
import { IDB } from './IDB';

require('mongoose-long')(mongoose);
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
  txId: String,
  blockHash: String,
  protocolVersion: Number,
  virtualChainId: Number,
  timestamp: Number,
  signerPublicKey: String,
  contractName: String,
  methodName: String,
  inputArguments: Array,
  executionResult: String,
  outputArguments: Array,
  outputEvents: Array,
});

export class MongoDB implements IDB {
  private db: mongoose.Mongoose;
  private BlockModel: mongoose.Model<mongoose.Document>;
  private TxModel: mongoose.Model<mongoose.Document>;
  private CacheModel: mongoose.Model<ICacheDocument>;

  constructor(private connectionUrl: string) {}

  public async init(): Promise<void> {
    mongoose.connection.once('connecting', () => console.log('mongoose connecting'));
    mongoose.connection.once('connected', () => console.log('mongoose connected'));
    mongoose.connection.once('disconnecting', () => console.log('mongoose disconnecting'));
    mongoose.connection.once('disconnected', () => console.log('mongoose disconnected'));
    mongoose.connection.once('error', e => console.log('mongoose error:', e));

    this.db = await mongoose.connect(this.connectionUrl, { useNewUrlParser: true });

    // model
    this.BlockModel = mongoose.model('Block', blockSchema);
    this.TxModel = mongoose.model('Tx', txSchema);
    this.CacheModel = mongoose.model('Cache', cacheSchema);
  }

  public async destroy() {
    if (this.db) {
      await this.db.disconnect();
      this.db = null;
    }
  }

  public async clearAll(): Promise<void> {
    await this.BlockModel.remove({});
    await this.TxModel.remove({});
    await this.CacheModel.remove({});
  }

  public async storeBlock(block: IBlock): Promise<void> {
    const startTime = Date.now();
    console.log(`Storing block #${block.blockHeight}`);
    const blockInstance = new this.BlockModel(block);
    await blockInstance.save();
    console.log(`block stored [${Date.now() - startTime}ms.]`);
  }

  public async getBlockByHash(blockHash: string): Promise<IBlock> {
    const startTime = Date.now();
    console.log(`Searching for block by hash: ${blockHash}`);
    const result = await this.BlockModel.findOne({ blockHash }, { _id: false, __v: false })
      .lean()
      .exec();

    if (result) {
      console.log(`block found [${Date.now() - startTime}ms.]`);
      // in the db we store the blockHeight as long (For better search), here we convert it back to string
      result.blockHeight = result.blockHeight.toString();
      return result;
    } else {
      console.log(`block not found [${Date.now() - startTime}ms.]`);
      return null;
    }
  }

  public async getBlockByHeight(blockHeight: string): Promise<IBlock> {
    const startTime = Date.now();
    console.log(`Searching for block by height: ${blockHeight}`);
    const result = await this.BlockModel.findOne({ blockHeight }, { _id: false, __v: false })
      .lean()
      .exec();

    if (result) {
      console.log(`block found [${Date.now() - startTime}ms.]`);
      // in the db we store the blockHeight as long (For better search), here we convert it back to string
      result.blockHeight = result.blockHeight.toString();
      return result;
    } else {
      console.log(`block not found [${Date.now() - startTime}ms.]`);
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
    if (Array.isArray(tx)) {
      return Promise.all(tx.map(t => this.storeTx(t)));
    } else {
      const txInstance = new this.TxModel(tx);
      await txInstance.save();
    }
  }

  public async getTxById(txId: string): Promise<IRawTx> {
    const startTime = Date.now();
    console.log(`Searching for tx by txId: ${txId}`);
    const result = await this.TxModel.findOne({ txId }, { _id: false, __v: false })
      .lean()
      .exec();

    console.log(`tx found [${Date.now() - startTime}ms.]`);
    return result;
  }
}
