import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';

export interface IOrbsClient {
  getBlock(blockHeight: bigint): Promise<GetBlockResponse>;
}
