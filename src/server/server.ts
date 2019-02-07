import * as express from 'express';
import { apiRouter } from './routes/api-router';
import { staticsRouter } from './routes/statics-router';
import { staticsDevRouter } from './routes/statics-dev-router';
import * as config from './config';
import { Storage } from './storage';

export function initServer(storage: Storage) {
  const app = express();

  app.use(apiRouter(storage));
  console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  app.use(config.IS_PRODUCTION ? staticsRouter() : staticsDevRouter());

  const server = app.listen(config.SERVER_PORT, () => {
    console.log(`App listening on port ${config.SERVER_PORT}!`);
  });
  return server;
}
