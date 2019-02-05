import axios from 'axios';
import { IBlock } from '../../shared/IBlock';
import { ITx } from '../../shared/ITx';

export function loadBlock(blockHash: string): Promise<IBlock> {
  return axios.get(`/api/block/${blockHash}`).then(res => res.data as IBlock);
}

export function loadTx(txHash: string): Promise<ITx> {
  return axios.get(`/api/tx/${txHash}`).then(res => res.data as ITx);
}
