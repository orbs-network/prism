/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import * as express from 'express';
import * as path from 'path';
import * as config from './config';
import { forceHttps } from './middlewares/ForceHttps';
import { apiRouter } from './routes/api-router';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';
import { Storage } from './storage/storage';

export function initServer(storage: Storage) {
  const app = express();

  if (config.FORCE_HTTPS) {
    app.use(forceHttps);
  }

  app.set('view engine', 'ejs');
  app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
  app.use('/logs', express.static(path.join(process.cwd(), 'logs')));
  app.use(staticsRouter());
  app.use(apiRouter(storage));
  app.use(pagesRouter());

  const server = app.listen(config.SERVER_PORT, () => {
    console.log(`App listening on port ${config.SERVER_PORT}!`);
  });
  return server;
}
