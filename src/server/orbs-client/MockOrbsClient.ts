/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import { generateOverflowGetBlockRespose, generateRandomGetBlockResponse } from '../orbs-adapter/fake-blocks-generator';

export class MockOrbsClient {
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
      const block = generateRandomGetBlockResponse(BigInt(this.orbsBlockChain.size + 1));
      this.orbsBlockChain.set(BigInt(block.blockHeight), block);
    }
  }
}
