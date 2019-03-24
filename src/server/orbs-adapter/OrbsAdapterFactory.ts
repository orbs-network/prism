/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Client, NetworkType } from 'orbs-client-sdk';
import { ORBS_ENDPOINT, ORBS_NETWORK_TYPE, ORBS_VIRTUAL_CHAIN_ID, POOLING_INTERVAL } from '../config';
import { OrbsAdapter } from './OrbsAdapter';

export function genOrbsAdapter(): OrbsAdapter {
  const orbsClient = new Client(ORBS_ENDPOINT, ORBS_VIRTUAL_CHAIN_ID, ORBS_NETWORK_TYPE as NetworkType);
  return new OrbsAdapter(orbsClient, POOLING_INTERVAL);
}
