/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import axios from 'axios';
import { IBlock, IBlockSummary } from '../../shared/IBlock';
import { IRawTx } from '../../shared/IRawData';
import { ISearchResult } from '../../shared/ISearchResult';

export async function getLatestBlocksSummary(numOfBlocks: number): Promise<IBlockSummary[]> {
  const res = await axios.get(`/api/blocks/summary?count=${numOfBlocks}`);
  return res.data as IBlockSummary[];
}

export async function loadBlock(blockHeight: string): Promise<IBlock> {
  const res = await axios.get(`/api/block/${blockHeight}`);
  return res.data as IBlock;
}

export async function loadTx(txId: string): Promise<IRawTx> {
  const res = await axios.get(`/api/tx/${txId}`);
  return res.data as IRawTx;
}

export async function search(term: string): Promise<ISearchResult> {
  const res = await axios.get(`/api/search/${term}`);
  return res.data as ISearchResult;
}
