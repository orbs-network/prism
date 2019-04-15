/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { cap } from '../reducers/capper';

describe('capper', () => {
  it('should cap a given map', () => {
    const map = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 };
    const actual = cap(map, 10);
    expect(Object.keys(actual)).toEqual(['f', 'g', 'h', 'i', 'j']);
  });

  it('should ignore the given keys', () => {
    const map = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 };
    const actual = cap(map, 10, 0.5, ['a']);
    expect(Object.keys(actual)).toEqual(['a', 'g', 'h', 'i', 'j']);
  });

  it('should respect the ignored keys over the releasePercent', () => {
    const map = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 };
    const actual = cap(map, 10, 0.5, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']);
    expect(Object.keys(actual)).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']);
  });

  it('should respect the ignored keys from the end of the map', () => {
    const map = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 };
    const actual = cap(map, 10, 0.5, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
    expect(Object.keys(actual)).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g']);
  });

  it('should ignore releasePercent larger than 1', () => {
    const map = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10 };
    const actual = cap(map, 10, 2);
    expect(Object.keys(actual)).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']);
  });
});
