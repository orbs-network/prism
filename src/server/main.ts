import { OrbsAdaper } from './orbs-adapter';
import { initServer } from './server';
import { Storage } from './storage';
import { WS } from './ws/ws';

async function main() {
  // statics and api server
  const server = initServer();

  const ws = new WS(server);
  const orbsAdapter = new OrbsAdaper();
  const storage = new Storage(orbsAdapter, ws);
}

main()
  .then(() => console.log('running'))
  .catch(err => console.log(`error: ${err}`));
