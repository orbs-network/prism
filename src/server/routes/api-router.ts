import * as bodyParser from 'body-parser';
import { Router } from 'express';

export function apiRouter() {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/block/:blockHeight', (req, res) => {
    res.send(`ok`);
  });

  router.get('/api/tx/:txHash', (req, res) => {
    res.send(`ok`);
  });

  router.get('/api/search/:term', (req, res) => {
    res.send(`ok`);
  });

  return router;
}
