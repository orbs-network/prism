/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { stringifyMethodCall } from '../args/argsStringifier';
import { generateRandomRawBlock } from '../orbs-adapter/fake-blocks-generator';

describe('argsStringifier', () => {
  it('should stringify Tx method name', async () => {
    const block = generateRandomRawBlock(1n);

    const tx = block.transactions[0];
    tx.methodName = 'METHOD_NAME';
    tx.inputArguments = [];
    const actual = stringifyMethodCall(tx);
    const expected = `METHOD_NAME()`;
    expect(actual).toEqual(expected);
  });

  it('should stringify Tx args', async () => {
    const block = generateRandomRawBlock(1n);

    const tx = block.transactions[0];
    tx.methodName = 'METHOD_NAME';
    tx.inputArguments = [
      { type: 'string', value: 'ABC' },
      { type: 'uint32', value: '10' },
      { type: 'uint64', value: '100' },
      { type: 'bytes', value: '0x1234567890abcdef' },
    ];
    const actual = stringifyMethodCall(tx);
    const expected = `METHOD_NAME('ABC', 10, 100, bytes)`;
    expect(actual).toEqual(expected);
  });

  it('should stringify Tx return args', async () => {
    const block = generateRandomRawBlock(1n);

    const tx = block.transactions[0];
    tx.methodName = 'METHOD_NAME';
    tx.inputArguments = [
      { type: 'string', value: 'ABC' },
      { type: 'uint32', value: '10' },
      { type: 'uint64', value: '100' },
      { type: 'bytes', value: '0x1234567890abcdef' },
    ];
    tx.outputArguments = [
      { type: 'bytes', value: '0xfedcba0987654321' },
      { type: 'uint64', value: '200' },
      { type: 'uint32', value: '20' },
      { type: 'string', value: 'DEF' },
    ];
    const actual = stringifyMethodCall(tx);
    const expected = `METHOD_NAME('ABC', 10, 100, bytes) => (bytes, 200, 20, 'DEF')`;
    expect(actual).toEqual(expected);
  });

  it('should shorten long strings', async () => {
    const block = generateRandomRawBlock(1n);
    const tx = block.transactions[0];
    tx.methodName = 'METHOD_NAME';

    tx.inputArguments = tx.outputArguments = [{ type: 'string', value: '123' }];
    expect(stringifyMethodCall(tx)).toEqual(`METHOD_NAME('123') => ('123')`);

    tx.inputArguments = tx.outputArguments = [{ type: 'string', value: '1234' }];
    expect(stringifyMethodCall(tx)).toEqual(`METHOD_NAME('1234') => ('1234')`);

    tx.inputArguments = tx.outputArguments = [{ type: 'string', value: '12345' }];
    expect(stringifyMethodCall(tx)).toEqual(`METHOD_NAME('12345') => ('12345')`);

    tx.inputArguments = tx.outputArguments = [{ type: 'string', value: '123456' }];
    expect(stringifyMethodCall(tx)).toEqual(`METHOD_NAME('123456') => ('123456')`);

    tx.inputArguments = tx.outputArguments = [{ type: 'string', value: '1234567' }];
    expect(stringifyMethodCall(tx)).toEqual(`METHOD_NAME('1234567') => ('1234567')`);

    tx.inputArguments = tx.outputArguments = [{ type: 'string', value: '12345678' }];
    expect(stringifyMethodCall(tx)).toEqual(`METHOD_NAME('12345...') => ('12345...')`);

  });
});
