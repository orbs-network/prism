import { Storage } from '../storage/storage';

export async function detectBlockChainGaps(storage: Storage, fromHeight: bigint, toHeight: bigint): Promise<Array<bigint>> {
  const result: Array<bigint> = [];
  for (let height = fromHeight; height <= toHeight; height++) {
    const storageBlock = await storage.getBlockByHeight(height.toString());
    console.log(`[Gaps Detector], do we have block at ${height}?`);
    if (!storageBlock) {
      console.log(`[Gaps Detector], nop.`);
      result.push(height);
    } else {
      console.log(`[Gaps Detector], yeap.`);
    }
  }

  return result;
}
