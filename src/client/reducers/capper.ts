// This function will check if the given map has more than "threshold" keys.
// If it finds that it does, it will remove "releasePercent" keys from the map
// While ignoring the "ignoredKeys"
//
// This function is good to make sure that the given map object will not take
// too much memory over time.
export function cap<T>(
  map: { [key: string]: T },
  threshold: number = 100,
  releasePercent: number = 0.5,
  ignoredKeys: string[] = [],
): { [key: string]: T } {
  const keys = Object.keys(map);
  let currentNumOfKeys = keys.length;
  if (currentNumOfKeys >= threshold) {
    const newNumberOfKeys = threshold * releasePercent;
    for (const key in map) {
      if (newNumberOfKeys >= currentNumOfKeys) {
        break;
      }
      const canDelete = ignoredKeys.indexOf(key) === -1;
      if (canDelete) {
        delete map[key];
        currentNumOfKeys--;
      }
    }
  }

  return map;
}
