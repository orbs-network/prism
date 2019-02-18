import * as bodyParser from 'body-parser';
import { Router } from 'express';
import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';
import { Storage } from '../storage/storage';

export function apiRouter(storage: Storage) {
  const router = Router();
  router.use(bodyParser.json());
  router.get('/api/block/:blockHash', async (req, res) => {
    const blockHash: string = req.params.blockHash;
    const block: IBlock = await storage.getBlockByHash(blockHash);
    if (!block) {
      res.send(404);
    } else {
      res.json(block);
    }
  });

  router.get('/api/tx/:txId', async (req, res) => {
    const txId: string = req.params.txId;
    const tx: ITx = await storage.getTx(txId);
    if (!tx) {
      return res.send(404);
    }
    res.json(tx);
  });

  router.get('/api/search/:term', async (req, res) => {
    const term: string = req.params.term;
    const searchResult = await storage.search(term);
    if (searchResult) {
      res.json(searchResult);
    } else {
      res.send(404);
    }
  });

  return router;
}
