import { IDB } from './IDB';
import { InMemoryDB } from './InMemoryDB';
import { PostgresDB } from './PostgresDB';

export function genDb(): IDB {
    // return new PostgresDB();
    return new InMemoryDB();
}