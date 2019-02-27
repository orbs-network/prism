export function uint8ArrayToHexString(arr: Uint8Array): string {
  return '0x' + Buffer.from(arr).toString('hex');
}

export function hexStringToUint8Array(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'hex'));
}
