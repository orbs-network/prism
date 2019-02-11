import { MockOrbsAdapter } from './orbs-adapter/MockOrbsAdapter';
import { initServer } from './server';
import { Indexer } from './indexer';
import { WS } from './ws/ws';
import { Storage } from './storage';
import { genDb } from './db/DBFactory';
import { genOrbsAdapter } from './orbs-adapter/OrbsAdapterFactory';

async function main() {
  // externals
  const orbsAdapter = genOrbsAdapter();
  const db = genDb();

  // internals
  const storage = new Storage();
  const server = initServer(storage);
  const ws = new WS(server);
  const indexer = new Indexer(orbsAdapter, storage);

  storage.init(ws, db);
}

main()
  .then(() => console.log('running'))
  .catch(err => console.log(`error: ${err}`));
