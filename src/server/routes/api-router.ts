import * as bodyParser from 'body-parser';
import { Router } from 'express';
import { IRawBlock, IBlock } from '../../shared/IBlock';
import { Storage } from '../storage/storage';
import { ITx } from '../../shared/ITx';

export function apiRouter(storage: Storage) {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/block/:blockHash', async (req, res) => {
    const blockHash: string = req.params.blockHash;
    const block: IBlock = await storage.getBlock(blockHash);
    if (!block) {
      res.send(404);
    } else {
      res.json(block);
    }
  });

  router.get('/api/tx/:txHash', async (req, res) => {
    const txHash: string = req.params.txHash;
    const tx: ITx = await storage.getTx(txHash);
    if (!tx) {
      return res.send(404);
    }
    res.json(tx);
  });

  router.get('/api/search/:term', async (req, res) => {
    const term: string = req.params.term;
    const searchResult = await storage.findHash(term);
    console.log(`search results`, searchResult);
    if (searchResult) {
      res.json(searchResult);
    } else {
      res.send(404);
    }
  });

  return router;
}
