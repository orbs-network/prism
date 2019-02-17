import { IDB } from './IDB';
import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';
import * as url from 'url';
import * as pg from 'pg';

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');
const config: pg.PoolConfig = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: parseInt(params.port, 10),
  database: params.pathname.split('/')[1],
  ssl: process.env.NODE_ENV === 'production',
};

export class PostgresDB implements IDB {
  public pool: pg.Pool;

  public async init(): Promise<void> {
    this.pool = new pg.Pool(config);
    await this.initTables();
  }

  public async destroy() {
    await this.pool.end();
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

  public async getTxByHash(hash: string): Promise<ITx> {
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
      '{${block.txsHashes.map(t => `"${t}"`).join(',')}}'
    );
  `);
  }

  public async getBlockByHash(hash: string): Promise<IBlock> {
    const query = `
      SELECT hash, height, time, txs_hashes as "txsHashes"
      FROM blocks
      WHERE hash = '${hash}';
    `;
    const rows = await this.query(query);

    console.log(rows[0]);
    return rows.length === 0 ? null : rows[0];
  }

  private async storeOneTx(tx: ITx): Promise<void> {
    await this.query(`
    INSERT INTO txs (hash, block_hash, data)
    VALUES (
      '${tx.txHash}',
      '${tx.blockHash}',
      '${tx.data}'
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
