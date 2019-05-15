const BMin = (a: bigint, b: bigint) => (a < b ? a : b);
export async function loopInChunks<T>(
  startAt: bigint,
  endAt: bigint,
  chunkSize: bigint,
  cb: (idx: bigint) => Promise<T>,
): Promise<T[]> {
  const allResults: T[] = [];
  for (let i = startAt; i <= endAt; i += chunkSize) {
    const from = i;
    const to = BMin(i + (chunkSize - 1n), endAt);
    const promises: Array<Promise<T>> = [];
    for (let idx = from; idx <= to; idx++) {
      promises.push(cb(idx));
    }
    const chunkResults = await Promise.all(promises);
    allResults.push(...chunkResults);
  }
  return allResults;
}
