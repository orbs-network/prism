import { combineReducers, Reducer } from 'redux';
import { blocksByHash, IBlocksByHash } from './blocksReducer';
import { txsByHash, ITxsByHash } from './txsReducer';
import { recentBlocksHashs, RecentBlocksHashes } from './recentBlocksReducer';

export interface IRootState {
  txsByHash: ITxsByHash;
  blocksByHash: IBlocksByHash;
  recentBlocksHashs: RecentBlocksHashes;
}

export const rootReducer: Reducer<IRootState> = combineReducers<IRootState>({
  txsByHash,
  blocksByHash,
  recentBlocksHashs,
});
