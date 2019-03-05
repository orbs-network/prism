import { IDB } from './IDB';
import { InMemoryDB } from './InMemoryDB';
import { PostgresDB } from './PostgresDB';
import { MongoDB } from './MongoDB';
import { POSTGRES_URL, MONGO_URL, DATABASE_TYPE } from '../config';

export function genDb(): IDB {
  switch (DATABASE_TYPE) {
    case 'MONGO':
      return new MongoDB(MONGO_URL);

    case 'POSTGRES':
      return new PostgresDB(POSTGRES_URL);

    default:
      return new InMemoryDB();
  }
}
