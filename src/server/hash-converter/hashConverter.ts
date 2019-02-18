export function uint8ArrayToString(arr: Uint8Array): string {
  return '0x' + Buffer.from(arr).toString('hex');
}

export function stringToUint8Array(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'hex'));
}
