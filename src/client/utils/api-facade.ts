import axios from 'axios';
import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';
import { ISearchResult } from '../../shared/ISearchResult';

export async function loadBlock(blockHash: string): Promise<IBlock> {
  const res = await axios.get(`/api/block/${blockHash}`);
  return res.data as IBlock;
}

export async function loadTx(txHash: string): Promise<ITx> {
  const res = await axios.get(`/api/tx/${txHash}`);
  return res.data as ITx;
}

export async function search(term: string): Promise<ISearchResult> {
  const res = await axios.get(`/api/search/${term}`);
  return res.data as ISearchResult;
}
