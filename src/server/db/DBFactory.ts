import { IDB } from './IDB';
import { InMemoryDB } from './InMemoryDB';
import { PostgresDB } from './PostgresDB';
import { DATABASE_URL } from '../config';

export function genDb(): IDB {
  return DATABASE_URL ? new PostgresDB(DATABASE_URL) : new InMemoryDB();
}
