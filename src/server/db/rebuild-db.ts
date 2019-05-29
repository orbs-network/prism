/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import * as winston from 'winston';
import { MongoDB } from './MongoDB';
import { genLogger } from '../logger/LoggerFactory';
import { Storage } from '../storage/storage';
import * as fs from 'fs';
import { OrbsAdapter } from '../orbs-adapter/OrbsAdapter';
import { Client, NetworkType } from 'orbs-client-sdk';
import * as childProcess from 'child_process';

async function storeBlockAt(height: bigint, storage: Storage, orbsAdapter: OrbsAdapter): Promise<void> {
  const block = await orbsAdapter.getBlockAt(height);
  if (block) {
    // await storage.handleNewBlock(block);
  } else {
    console.error(`block at ${height} not stored`);
  }
}

async function storeBlocksChunk(
  fromHeight: bigint,
  toHeight: bigint,
  storage: Storage,
  orbsAdapter: OrbsAdapter,
): Promise<void> {
  const promises: Array<Promise<void>> = [];
  for (let i = fromHeight; i <= toHeight; i++) {
    promises.push(storeBlockAt(i, storage, orbsAdapter));
  }
  await Promise.all(promises);
  console.log(`blocks from ${fromHeight} to ${toHeight} stored`);
}

const CHUNK_SIZE = 10n;
async function storeAllBlocks(toHeight: bigint, storage: Storage, orbsAdapter: OrbsAdapter): Promise<void> {
  for (let i = 1n; i < toHeight; i = i + CHUNK_SIZE) {
    const from = i;
    let to = i + CHUNK_SIZE - 1n;
    if (to > toHeight) {
      to = toHeight;
    }
    await storeBlocksChunk(from, to, storage, orbsAdapter);
  }
  console.log(`done storing all block from 1 to ${toHeight}`);
  // mark the cache with the latest block
  await storage.setHeighestConsecutiveBlockHeight(toHeight);
}

function genOrbsAdapter(logger: winston.Logger, orbsEndpoint: string, vchainId: number): OrbsAdapter {
  const orbsClient = new Client(orbsEndpoint, vchainId, 'TEST_NET' as NetworkType);
  return new OrbsAdapter(logger, orbsClient);
}

function pauseFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForHeighestBlockHeight(orbsAdapter: OrbsAdapter): Promise<bigint> {
  let heighestBlockHeight = 0n;
  console.log('Waiting for Orbs Network to initialize');
  while (heighestBlockHeight === 0n || heighestBlockHeight === null) {
    heighestBlockHeight = await orbsAdapter.getLatestKnownHeight();
    await pauseFor(1000);
  }

  return heighestBlockHeight;
}

(async () => {
  // params
  const vchainId = 2013;
  const REMOTE_MONGODB_URI = '';
  const blockStorageFile = '/Users/gil/Documents/blocks-2013';
  const LOCAL_MONGODB_URI = `mongodb://localhost:27017/prism_${vchainId}`;

  const logger: winston.Logger = genLogger(false, false, false);
  const localDb = new MongoDB(logger, LOCAL_MONGODB_URI, false);
  const storage = new Storage(localDb);

  const nodeConfigJson = {
    'node-address': 'a328846cd5b4979d68a8c58a9bdfeee657b34de7',
    'node-private-key': '901a1a0bfbe217593062a054e561e708707cb814a123474c25fd567a0fe088f8',
    'benchmark-consensus-constant-leader': 'a328846cd5b4979d68a8c58a9bdfeee657b34de7',
    'genesis-validator-addresses': [
      'a328846cd5b4979d68a8c58a9bdfeee657b34de7',
      'd27e2e7398e2582f63d0800330010b3e58952ff6',
      '6e2cb55e4cbe97bf5b1e731d51cc2c285d83cbf9',
      'c056dfc0d1fbc7479db11e61d1b0b57612bf7f17',
    ],
    'topology-nodes': [
      {
        address: 'a328846cd5b4979d68a8c58a9bdfeee657b34de7',
        ip: '192.168.199.2',
        port: 4400,
      },
      {
        address: 'd27e2e7398e2582f63d0800330010b3e58952ff6',
        ip: '192.168.199.3',
        port: 4400,
      },
      {
        address: '6e2cb55e4cbe97bf5b1e731d51cc2c285d83cbf9',
        ip: '192.168.199.4',
        port: 4400,
      },
      {
        address: 'c056dfc0d1fbc7479db11e61d1b0b57612bf7f17',
        ip: '192.168.199.5',
        port: 4400,
      },
    ],
    'ethereum-endpoint': 'http://192.168.199.6:8545',
    'logger-full-log': true,
    'processor-sanitize-deployed-contracts': false,
    'virtual-chain-id': vchainId,
  };

  // rename current "blocks" file to "blocks.tmp"
  fs.renameSync('/usr/local/var/orbs/blocks', '/usr/local/var/orbs/blocks.tmp');
  try {
    // copy the blockStorageFile file to /usr/local/var/orbs as "blocks"
    fs.copyFileSync(blockStorageFile, '/usr/local/var/orbs/blocks');
    try {
      // create a config file with the vchainId
      fs.writeFileSync('./node-config.json', JSON.stringify(nodeConfigJson, null, 2));
      try {
        // start orbs-network with the new config file
        const orbsMain = `${process.env.GOPATH}/src/github.com/orbs-network/orbs-network-go/main.go`;
        const orbsNetwork = childProcess.spawn('go', ['run', orbsMain, '--config', './node-config.json'], {
          stdio: 'inherit',
        });

        // initialize the orbs adapter against the local orbs-network
        const orbsAdapter = genOrbsAdapter(logger, 'http://localhost:8080', vchainId);

        const heighestBlockHeight = await waitForHeighestBlockHeight(orbsAdapter);

        // initialize the local db
        await localDb.init();

        // block by block call to Storage
        await storeAllBlocks(heighestBlockHeight, storage, orbsAdapter);

        // stop orbs-network
        orbsNetwork.kill();

        // export the local db to a binary file

        // drop the local db
        await localDb.clearAll();

        // disconnect from local db
        await localDb.destroy();

        // drop the remote db

        // import the remote db to a binary file

        // delete the exported local db dump
      } finally {
        fs.unlinkSync('./node-config.json');
      }
    } finally {
      // delete our "blocks" file
      fs.unlinkSync('/usr/local/var/orbs/blocks');
    }
  } finally {
    // rename back the "blocks.tmp" to "blocks"
    fs.renameSync('/usr/local/var/orbs/blocks.tmp', '/usr/local/var/orbs/blocks');
  }
  console.log('done');
})();
