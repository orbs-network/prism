/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Client, NetworkType, createAccount } from 'orbs-client-sdk';
import winston from 'winston';
import { IOrbsBlocksPolling, OrbsBlocksPolling } from 'orbs-blocks-polling-js';
import { ORBS_ENDPOINT, ORBS_NETWORK_TYPE, ORBS_VIRTUAL_CHAIN_ID } from '../config';
import { LocalSigner } from 'orbs-client-sdk';

export function genOrbsBlocksPolling(logger: winston.Logger): IOrbsBlocksPolling {
  const { publicKey, privateKey } = createAccount();
  const signer = new LocalSigner({ publicKey, privateKey });
  const orbsClient: Client = new Client(ORBS_ENDPOINT, ORBS_VIRTUAL_CHAIN_ID, ORBS_NETWORK_TYPE as NetworkType, signer);
  return new OrbsBlocksPolling(orbsClient, logger);
}
