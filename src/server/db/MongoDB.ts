import { IDB } from './IDB';
import * as mongoose from 'mongoose';
import { IBlock } from '../../shared/IBlock';
import { IRawTx } from '../orbs-adapter/IOrbsAdapter';

const blockSchema = new mongoose.Schema({
  blockHash: String,
  blockHeight: String,
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
  private db: any;
  private BlockModel: any;
  private TxModel: any;

  constructor(private connectionUrl: string) {}

  public async init(): Promise<void> {
    mongoose.connection.once('connecting', () => console.log('mongoose connecting'));
    mongoose.connection.once('connected', () => console.log('mongoose connected'));
    mongoose.connection.once('disconnecting', () => console.log('mongoose disconnecting'));
    mongoose.connection.once('disconnected', () => console.log('mongoose disconnected'));
    mongoose.connection.once('error', () => console.log('mongoose error'));

    this.db = await mongoose.connect(this.connectionUrl, { useNewUrlParser: true });

    // model
    this.BlockModel = mongoose.model('Block', blockSchema);
    this.TxModel = mongoose.model('Tx', txSchema);
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
  }

  public async storeBlock(block: IBlock): Promise<void> {
    const blockInstance = new this.BlockModel(block);
    await blockInstance.save();
  }

  public async getBlockByHash(blockHash: string): Promise<IBlock> {
    const result = await this.BlockModel.findOne({ blockHash }, { _id: false, __v: false })
      .lean()
      .exec();
    return result;
  }
  public async getBlockByHeight(blockHeight: string): Promise<IBlock> {
    const result = await this.BlockModel.findOne({ blockHeight }, { _id: false, __v: false })
      .lean()
      .exec();
    return result;
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
    const result = await this.TxModel.findOne({ txId }, { _id: false, __v: false })
      .lean()
      .exec();
    return result;
  }
}
