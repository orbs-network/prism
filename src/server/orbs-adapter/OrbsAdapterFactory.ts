import { Client, NetworkType } from 'orbs-client-sdk';
import { ORBS_ENDPOINT, ORBS_NETWORK_TYPE, ORBS_VIRTUAL_CHAIN_ID, POOLING_INTERVAL } from '../config';
import { OrbsAdapter } from './OrbsAdapter';

export function genOrbsAdapter(): OrbsAdapter {
  const orbsClient = new Client(ORBS_ENDPOINT, ORBS_VIRTUAL_CHAIN_ID, ORBS_NETWORK_TYPE as NetworkType);
  return new OrbsAdapter(orbsClient, POOLING_INTERVAL);
}
