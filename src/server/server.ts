/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import * as express from 'express';
import { apiRouter } from './routes/api-router';
import { staticsRouter } from './routes/statics-router';
import { staticsDevRouter } from './routes/statics-dev-router';
import * as config from './config';
import { Storage } from './storage/storage';
import { forceHttps } from './middlewares/ForceHttps';

export function initServer(storage: Storage) {
  const app = express();

  if (config.IS_PRODUCTION) {
    app.use(forceHttps);
  }

  app.use(apiRouter(storage));
  app.use(config.IS_PRODUCTION ? staticsRouter() : staticsDevRouter());

  const server = app.listen(config.SERVER_PORT, () => {
    console.log(`App listening on port ${config.SERVER_PORT}!`);
  });
  return server;
}
