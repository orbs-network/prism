import { combineReducers, Reducer } from 'redux';
import { blocksByHash, IBlocksByHeight } from './blocksReducer';
import { txsById, ITxsById } from './txsReducer';
import { recentBlocksHashs, RecentBlocksHashes } from './recentBlocksReducer';

export interface IRootState {
  txsById: ITxsById;
  blocksByHash: IBlocksByHeight;
  recentBlocksHashs: RecentBlocksHashes;
}

export const rootReducer: Reducer<IRootState> = combineReducers<IRootState>({
  txsById,
  blocksByHash,
  recentBlocksHashs,
});
