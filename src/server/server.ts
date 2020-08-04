/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import express from 'express';
import path from 'path';
import config from './config';
import { forceHttps } from './middlewares/ForceHttps';
import { apiRouter } from './routes/api-router';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';
import { Storage } from './storage/storage';
import { metricsRouter } from './routes/metrics-router';
import passport from 'passport';
import { DigestStrategy } from 'passport-http';

export function initServer(storage: Storage) {
  const app = express();

  if (config.FORCE_HTTPS) {
    app.use(forceHttps);
  }

  if (config.AUTHENTICATION) {
    const [username, password] = config.AUTHENTICATION.split(':');
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(
      new DigestStrategy({ qop: 'auth' }, function (usernameArg, done) {
        return done(null, usernameArg === username, password);
      }),
    );
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      done(null, user);
    });
    app.use(passport.authenticate('digest'));
  }

  app.set('view engine', 'ejs');
  app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
  app.use('/logs', express.static(path.join(process.cwd(), 'logs')));
  app.use(staticsRouter());
  app.use(apiRouter(storage));
  app.use(metricsRouter(storage));
  app.use(pagesRouter());

  const server = app.listen(config.SERVER_PORT, () => {
    console.log(`App listening on port ${config.SERVER_PORT}!`);
  });
  return server;
}
