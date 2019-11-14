/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { argAddress, argUint64, Client, createAccount, LocalSigner, NetworkType } from 'orbs-client-sdk';
import { Account } from 'orbs-client-sdk/dist/orbs/Account';
import { ORBS_ENDPOINT, ORBS_NETWORK_TYPE, ORBS_VIRTUAL_CHAIN_ID } from '../src/server/config';

export class OrbsClientSdkDriver {
  private receiver: Account;
  private client: Client;

  constructor() {
    this.receiver = createAccount();
    const signer = new LocalSigner(this.receiver);
    this.client = new Client(ORBS_ENDPOINT, ORBS_VIRTUAL_CHAIN_ID, ORBS_NETWORK_TYPE as NetworkType, signer);
  }

  public async transferTokensTx(
    amount: number,
  ): Promise<{ txId: string; blockHeight: bigint; receiverAddress: string }> {
    const receiverAddress = this.receiver.address;
    const [tx, txId] = await this.client.createTransaction(
      'BenchmarkToken',
      'transfer',
      [argUint64(amount), argAddress(receiverAddress)],
    );

    const transferResponse = await this.client.sendTransaction(tx);
    if (transferResponse.requestStatus !== 'COMPLETED') {
      delete transferResponse.blockHeight;
      throw new Error(
        `transferResponse.requestStatus !== 'COMPLETED', Got transferResponse ${JSON.stringify(
          transferResponse,
          null,
          2,
        )}`,
      );
    }

    if (transferResponse.executionResult !== 'SUCCESS') {
      delete transferResponse.blockHeight;
      throw new Error(
        `transferResponse.executionResult !== 'SUCCESS', Got transferResponse ${JSON.stringify(
          transferResponse,
          null,
          2,
        )}`,
      );
    }
    if (transferResponse.transactionStatus !== 'COMMITTED') {
      delete transferResponse.blockHeight;
      throw new Error(
        `transferResponse.transactionStatus !== 'COMMITTED', Got transferResponse ${JSON.stringify(
          transferResponse,
          null,
          2,
        )}`,
      );
    }

    const { blockHeight } = transferResponse;
    return { txId, blockHeight, receiverAddress };
  }
}
