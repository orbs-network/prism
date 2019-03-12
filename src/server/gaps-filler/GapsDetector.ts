import { Storage } from '../storage/storage';

export async function detectBlockChainGaps(storage: Storage): Promise<Array<bigint>> {
  const result: Array<bigint> = [];
  const latestHeight = await storage.getLatestBlockHeight();
  for (let height = 1n; height < latestHeight; height++) {
    const storageBlock = await storage.getBlockByHeight(height.toString());
    if (!storageBlock) {
      result.push(height);
    }
  }

  return result;
}
