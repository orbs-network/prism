import { IDB } from './IDB';
import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';
import * as url from 'url';
import * as pg from 'pg';

export class PostgresDB implements IDB {
  private config: pg.PoolConfig;
  private pool: pg.Pool;

  constructor(connectionUrl: string) {
    const params = url.parse(connectionUrl);
    const auth = params.auth.split(':');
    this.config = {
      user: auth[0],
      password: auth[1],
      host: params.hostname,
      port: parseInt(params.port, 10),
      database: params.pathname.split('/')[1],
      ssl: process.env.NODE_ENV === 'production',
    };
  }

  public async init(): Promise<void> {
    this.pool = new pg.Pool(this.config);
    await this.initTables();
  }

  public async destroy() {
    await this.pool.end();
  }

  public async clearAll(): Promise<void> {
    // TODO: implement
  }

  public async storeTx(tx: ITx | ITx[]): Promise<void> {
    if (Array.isArray(tx)) {
      for (const t of tx) {
        await this.storeOneTx(t);
      }
    } else {
      await this.storeOneTx(tx);
    }
  }

  public async getTxById(hash: string): Promise<ITx> {
    const query = `
      SELECT hash, block_hash as "blockHash", data
      FROM txs
      WHERE hash = '${hash}';
    `;
    const rows = await this.query(query);

    return rows.length === 0 ? null : rows[0];
  }

  public async storeBlock(block: IBlock): Promise<void> {
    await this.query(`
    INSERT INTO blocks (hash, height, time, txs_hashes)
    VALUES (
      '${block.blockHash}',
      ${block.blockHeight},
      ${block.blockTimestamp},
      '{${block.txIds.map(t => `"${t}"`).join(',')}}'
    );
  `);
  }

  public async getBlockByHash(blockHash: string): Promise<IBlock> {
    const query = `
      SELECT hash, height, time, txs_hashes as "txIds"
      FROM blocks
      WHERE hash = '${blockHash}';
    `;
    const rows = await this.query(query);

    console.log(rows[0]);
    return rows.length === 0 ? null : rows[0];
  }

  public async getBlockByHeight(blockHeight: string): Promise<IBlock> {
    const query = `
      SELECT hash, height, time, txs_hashes as "txIds"
      FROM blocks
      WHERE height = '${blockHeight}';
    `;
    const rows = await this.query(query);

    console.log(rows[0]);
    return rows.length === 0 ? null : rows[0];
  }

  private async storeOneTx(tx: ITx): Promise<void> {
    await this.query(`
    INSERT INTO txs (hash, block_hash, data)
    VALUES (
      '${tx.txId}',
      '${tx.blockHash}',
      'DUMMY_DATA'
    );
  `);
  }

  private async initTables(): Promise<void> {
    await this.createBlocksTable();
    await this.createTxsTable();
  }

  private async createBlocksTable(): Promise<void> {
    // TODO: verify fields types and sizes
    await this.query(`
    CREATE TABLE IF NOT EXISTS blocks (
      hash VARCHAR UNIQUE PRIMARY KEY,
      height BIGINT NOT NULL,
      time BIGINT NOT NULL,
      txs_hashes VARCHAR[]
    );
    `);
  }

  private async createTxsTable(): Promise<void> {
    // TODO: verify fields types and sizes
    await this.query(`
    CREATE TABLE IF NOT EXISTS txs (
      hash VARCHAR UNIQUE PRIMARY KEY,
      block_hash VARCHAR NOT NULL,
      data VARCHAR
    );
    `);
  }

  private async query(queryStr: string, values?: any[]): Promise<any[]> {
    const client: pg.PoolClient = await this.pool.connect();
    try {
      const result: pg.QueryResult = await client.query(queryStr, values);
      return result.rows;
    } catch (e) {
      console.log(`Query error: ${e} query:${queryStr}`);
      throw e;
    } finally {
      client.release();
    }
  }
}