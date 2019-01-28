import * as express from 'express';
import { initServer } from './server';
import { WS } from './ws/ws';
import { generateRandomFakeBlock } from './fake-blocks-generator';

async function main() {
  // statics and api server
  const server = initServer();

  // ws for real-time data
  const ws = new WS(server);
  ws.init();
  setInterval(() => {
    ws.emit('new-block', generateRandomFakeBlock());
  }, 1000);
}

main()
  .then(() => console.log('running'))
  .catch(err => console.log(`error: ${err}`));
