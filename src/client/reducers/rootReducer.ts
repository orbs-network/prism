import { combineReducers, Reducer } from 'redux';
import { blocksByHash, IBlocksByHash } from './blocksByHashReducer';
import { recentBlocksHashs, RecentBlocksHashes } from './recentBlocksReducer';

export interface IRootState {
  blocksByHash: IBlocksByHash;
  recentBlocksHashs: RecentBlocksHashes;
}

export const rootReducer: Reducer<IRootState> = combineReducers<IRootState>({
  blocksByHash,
  recentBlocksHashs,
});
