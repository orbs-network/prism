import client from 'prom-client';

const pulledBlocksCounter = new client.Counter({
    name: 'new_blocks_received',
    help: 'How many new blocks were received since app startup.',
});

const dbBuilderBuiltBlocks = new client.Counter({
    name: 'blocks_built_by_db_builder',
    help: 'How many blocks were processed by DbBuilder since app startup.',
});

export function increasePulledBlocksCounter(increaseBy: number = 1) {
    pulledBlocksCounter.inc(increaseBy);
}

export function increaseDbBuilderBuiltBlocks(increaseBy: number) {
    dbBuilderBuiltBlocks.inc(increaseBy);
}