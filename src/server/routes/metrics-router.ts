/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Router } from 'express';
import { Storage } from '../storage/storage';
import httpStatusCodes from 'http-status-codes';
import client from 'prom-client';

export function metricsRouter(storage: Storage) {
  const router = Router();

  // Manual diagnostics
  router.get('/api/health/status', async (req, res) => {
    try {
      const diagnostics = await storage.getDiagnostics();
      res.send(diagnostics);
    } catch (e) {
      res.send(httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
  });

  // Prometheus
  router.get('/metrics', (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(client.register.metrics());
  });

  return router;
}
