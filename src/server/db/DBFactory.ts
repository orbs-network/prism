import { IDB } from './IDB';
import { InMemoryDB } from './InMemoryDB';

export function genDb(): IDB {
    return new InMemoryDB();
}