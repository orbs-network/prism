/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import * as path from 'path';
import * as express from 'express';
import { Router } from 'express';

export function staticsRouter() {
  const router = Router();
  const publicPath = path.join(__dirname, '..', '..', '..', 'public');

  // All the assets are in "public" folder (Done by Webpack)
  router.use('/public', express.static(publicPath));

  // Any route should render the web app html (Generated by Webpack)
  router.get('**', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));

  return router;
}
