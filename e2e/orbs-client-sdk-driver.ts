/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { argAddress, argUint64, Client, createAccount, NetworkType } from 'orbs-client-sdk';
import { Account } from 'orbs-client-sdk/dist/orbs/Account';
import { hexStringToUint8Array } from '../src/server/hash-converter/hashConverter';
import * as findUp from 'find-up';
import * as dotEnv from 'dotenv';

dotEnv.config({ path: findUp.sync('.env') });

const ORBS_ENDPOINT = process.env.ORBS_ENDPOINT;
const ORBS_VIRTUAL_CHAIN_ID = parseInt(process.env.ORBS_VIRTUAL_CHAIN_ID, 10);
const ORBS_NETWORK_TYPE = process.env.ORBS_NETWORK_TYPE;

// We use the same sender because he is the token holder (the first address that does a transaction of the token contract)
const sender: Account = {
  publicKey: hexStringToUint8Array('b72c9fe0f78b5b27769a1007fb6b77fe6743beef92d1cb6e262163cbd13c0e11'),
  privateKey: hexStringToUint8Array(
    '479cfc81fb55cf1ce75f66cd8549c4efef2ee585a4c19a34947c1e095d159aa5b72c9fe0f78b5b27769a1007fb6b77fe6743beef92d1cb6e262163cbd13c0e11',
  ),
  address: '0x960B27df51146BD3dE815EEa7B9464307AbEe433',
};

export class OrbsClientSdkDriver {
  private receiver: Account;
  private client: Client;

  constructor() {
    this.receiver = createAccount();
    this.client = new Client(ORBS_ENDPOINT, ORBS_VIRTUAL_CHAIN_ID, ORBS_NETWORK_TYPE as NetworkType);
  }

  public async transferTokensTx(
    amount: number,
  ): Promise<{ txId: string; blockHeight: bigint; receiverAddress: string }> {
    const receiverAddress = this.receiver.address;
    const [tx, txId] = this.client.createTransaction(
      sender.publicKey,
      sender.privateKey,
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
