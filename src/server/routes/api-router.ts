/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import * as bodyParser from 'body-parser';
import { Router } from 'express';
import { IBlock, IBlockSummary } from '../../shared/IBlock';
import { IContractData } from '../../shared/IContractData';
import { ITx } from '../../shared/ITx';
import { Storage } from '../storage/storage';

export function apiRouter(storage: Storage) {
  const router = Router();
  router.use(bodyParser.json());

  router.get('/api/blocks/summary', async (req, res) => {
    const count: number = Math.min(20, req.query.count ? parseInt(req.query.count, 10) : 5);
    const blocksSummary: IBlockSummary[] = await storage.getLatestBlocksSummary(count);
    res.json(blocksSummary);
  });

  router.get('/api/block/:blockHeight', async (req, res) => {
    const blockHeight: string = req.params.blockHeight;
    const block: IBlock = await storage.getBlockByHeight(blockHeight);
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

  router.get('/api/contract/:contractName', async (req, res) => {
    const contractName: string = req.params.contractName;

    const executionIdx: number = req.query.executionIdx ? Number(req.query.executionIdx) : undefined;
    const contractData: IContractData = await storage.getContractData(contractName, executionIdx);
    if (!contractData) {
      return res.send(404);
    }
    res.json(contractData);
  });

  router.get('/api/contracts', async (req, res) => {
    const contracts: string[] = await storage.getAllContractsNames();
    res.json(contracts);
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
