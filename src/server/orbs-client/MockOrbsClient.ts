import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { generateOverflowGetBlockRespose, generateRandomGetBlockRespose } from '../orbs-adapter/fake-blocks-generator';
import { IOrbsClient } from './IOrbsClient';

export class MockOrbsClient implements IOrbsClient {
  private orbsBlockChain: Map<bigint, GetBlockResponse> = new Map();

  public async getBlock(blockHeight: bigint): Promise<GetBlockResponse> {
    return new Promise((resolve, reject) => {
      let response: GetBlockResponse;
      if (blockHeight === 0n || blockHeight > this.orbsBlockChain.size) {
        response = generateOverflowGetBlockRespose(BigInt(this.orbsBlockChain.size));
      } else {
        response = this.orbsBlockChain.get(blockHeight);
        if (!response) {
          reject();
          return;
        }
      }

      resolve(response);
    });
  }

  public generateBlocks(count: number): void {
    for (let i = 0; i < count; i++) {
      const block = generateRandomGetBlockRespose(BigInt(this.orbsBlockChain.size + 1));
      this.orbsBlockChain.set(BigInt(block.blockHeight), block);
    }
  }
}
