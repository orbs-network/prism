import * as bodyParser from 'body-parser';
import { Router } from 'express';
import { IBlock } from '../../shared/IBlock';
import { Storage } from '../storage';

export function apiRouter(storage: Storage) {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/block/:blockHash', (req, res) => {
    const blockHash: string = req.params.blockHash;
    const block: IBlock = storage.getBlock(blockHash);
    res.json(block);
  });

  router.get('/api/tx/:txHash', (req, res) => {
    res.send(`ok`);
  });

  router.get('/api/search/:term', (req, res) => {
    res.send(`ok`);
  });

  return router;
}
