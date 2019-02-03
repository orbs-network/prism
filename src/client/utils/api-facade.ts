import axios from 'axios';
import { IBlock } from '../../shared/IBlock';

export function loadBlock(blockHash: string) {
  return axios.get(`/api/block/${blockHash}`).then(res => res.data as IBlock);
}
