import { Storage } from '../storage/storage';

export async function detectBlockChainGaps(storage: Storage, fromHeight: bigint, toHeight: bigint): Promise<Array<bigint>> {
  const result: Array<bigint> = [];
  const latestHeight = await storage.getLatestBlockHeight();
  console.log(`[Gaps Detector], latestHeight:${latestHeight}`);
  for (let height = fromHeight; height < latestHeight; height++) {
    const storageBlock = await storage.getBlockByHeight(height.toString());
    console.log(`[Gaps Detector], do we have block at ${latestHeight}?`);
    if (!storageBlock) {
      console.log(`[Gaps Detector], nop.`);
      result.push(height);
    } else {
      console.log(`[Gaps Detector], yeap.`);
    }
  }

  return result;
}
