export function hashToString(hash: Uint8Array): string {
  return Buffer.from(hash).toString('hex');
}

export function stringToHash(str: string): Uint8Array {
  return new Uint8Array(Buffer.from(str, 'hex'));
}
