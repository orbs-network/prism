import { OrbsAdaper } from './orbs-adapter';
import { initServer } from './server';
import { Indexer } from './indexer';
import { WS } from './ws/ws';
import { Storage } from './storage';

async function main() {
  // statics and api server
  const server = initServer();

  const ws = new WS(server);
  const orbsAdapter = new OrbsAdaper();
  const storage = new Storage(ws);
  const indexer = new Indexer(orbsAdapter, storage);
}

main()
  .then(() => console.log('running'))
  .catch(err => console.log(`error: ${err}`));
