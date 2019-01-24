import * as express from 'express';
import { initServer } from './server';
import { WS } from './ws/ws';

async function main() {
  // statics and api server
  const server = initServer();

  // ws for real-time data
  const ws = new WS(server);
  ws.init();
}

main()
  .then(() => console.log('running'))
  .catch(err => console.log(`error: ${err}`));
