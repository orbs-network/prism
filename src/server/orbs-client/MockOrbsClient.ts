import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { IOrbsClient } from './IOrbsClient';

export class MockOrbsClient implements IOrbsClient {
  private orbsBlockChain: Map<bigint, GetBlockResponse> = new Map();

  public async getBlock(blockHeight: bigint): Promise<GetBlockResponse> {
    return new Promise((resolve, reject) => {
      if (blockHeight === 0n || blockHeight > this.orbsBlockChain.size) {
        resolve(this.orbsBlockChain.size);
      } else {
        const result = this.orbsBlockChain.get(blockHeight);
        if (result) {
          resolve(result);
        } else {
          reject();
        }
      }
    });
  }

  public setOrbsBlock(block: GetBlockResponse): void {
    this.orbsBlockChain.set(BigInt(block.blockHeight), block);
  }
}
