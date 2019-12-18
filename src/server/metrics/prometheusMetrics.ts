import client from 'prom-client';

import { ORBS_VIRTUAL_CHAIN_ID } from '../config';

// Initializing default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const pulledBlocksCounter = new client.Counter({
    name: 'new_blocks_received',
    help: 'How many new blocks were received since app startup.',
    labelNames: ['vcid'],
});

const dbBuilderBuiltBlocks = new client.Counter({
    name: 'blocks_built_by_db_builder',
    help: 'How many blocks were processed by DbBuilder since app startup.',
    labelNames: ['vcid'],
});

export function increasePulledBlocksCounter(increaseBy: number = 1) {
    pulledBlocksCounter.inc( { vcid: ORBS_VIRTUAL_CHAIN_ID }, increaseBy);
}

export function increaseDbBuilderBuiltBlocks(increaseBy: number) {
    dbBuilderBuiltBlocks.inc({ vcid: ORBS_VIRTUAL_CHAIN_ID }, increaseBy);
}