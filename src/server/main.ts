import { OrbsAdaper } from './orbs-adapter';
import { initServer } from './server';
import { Indexer } from './indexer';
import { WS } from './ws/ws';
import { Storage } from './storage';

async function main() {
  const storage = new Storage();
  const orbsAdapter = new OrbsAdaper();
  const server = initServer(storage);
  const ws = new WS(server);
  const indexer = new Indexer(orbsAdapter, storage);

  storage.init(ws);
}

main()
  .then(() => console.log('running'))
  .catch(err => console.log(`error: ${err}`));
