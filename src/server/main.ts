import { genDb } from './db/DBFactory';
import { genOrbsAdapter } from './orbs-adapter/OrbsAdapterFactory';
import { initServer } from './server';
import { Storage } from './storage/storage';
import { WS } from './ws/ws';
import { GapsFiller } from './gaps-filler/GapsFiller';

async function main() {
  // externals
  const orbsAdapter = genOrbsAdapter();
  const db = genDb();
  await db.init(); // create tables if needed

  // internals
  const storage = new Storage(db);
  const server = initServer(storage);
  const ws = new WS(server);

  // link all the parts
  orbsAdapter.RegisterToNewBlocks(ws);
  orbsAdapter.RegisterToNewBlocks(storage);
  await orbsAdapter.init();

  const gapsFiller = new GapsFiller(storage, orbsAdapter);
  await gapsFiller.fillGaps();
}

main()
  .then(() => console.log('running'))
  .catch(err => console.log(`error: ${err}`));
