import axios from 'axios';
import { IBlock } from '../../shared/IBlock';
import { IRawTx } from '../../shared/IRawData';
import { ISearchResult } from '../../shared/ISearchResult';

export async function loadBlock(blockHash: string): Promise<IBlock> {
  const res = await axios.get(`/api/block/${blockHash}`);
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
