import * as bodyParser from 'body-parser';
import { Router } from 'express';
import { IRawBlock, IBlock } from '../../shared/IBlock';
import { Storage } from '../storage';
import { ITx } from '../../shared/ITx';

export function apiRouter(storage: Storage) {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/block/:blockHash', (req, res) => {
    const blockHash: string = req.params.blockHash;
    console.log('Searching for block:', blockHash);
    const block: IBlock = storage.getBlock(blockHash);
    console.log('found', block);
    res.json(block);
  });

  router.get('/api/tx/:txHash', (req, res) => {
    const txHash: string = req.params.txHash;
    const tx: ITx = storage.getTx(txHash);
    res.json(tx);
  });

  router.get('/api/search/:term', (req, res) => {
    const txHash: string = req.params.txHash;
    const searchResult = storage.findHash(txHash);
    if (searchResult) {
      res.json(searchResult);
    } else {
      res.json(`not found`);
    }
  });

  return router;
}
