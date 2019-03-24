/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import * as proxy from 'http-proxy-middleware';
import { Router } from 'express';

export function staticsDevRouter() {
  const router = Router();

  // All the assets are hosted by Webpack on localhost:8080 (Webpack-dev-server)
  router.use(
    '/public',
    proxy({
      target: 'http://localhost:8080/',
    }),
  );

  // Any route should render the web app html (hosted by by Webpack-dev-server)
  router.use(
    '**',
    proxy({
      target: 'http://localhost:8080/',
      pathRewrite: path => '/public/index.html',
    }),
  );

  return router;
}
