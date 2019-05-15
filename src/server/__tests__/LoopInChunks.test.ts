/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { loopInChunks } from '../chunker/LoopInChunks';
import { sleep } from '../gaps-filler/Cron';

describe('LoopInChunks', () => {
  it('should loop on a given range', done => {
    const resolveMap = {};
    const cb = (idx: bigint) => new Promise(r => (resolveMap[idx.toString()] = r));
    loopInChunks(0n, 6n, 3n, cb).then(() => done());
    sleep(30)
      .then(() => {
        expect(resolveMap[0]).toBeDefined();
        expect(resolveMap[1]).toBeDefined();
        expect(resolveMap[2]).toBeDefined();
        expect(resolveMap[3]).not.toBeDefined();
        expect(resolveMap[4]).not.toBeDefined();
        expect(resolveMap[5]).not.toBeDefined();
        expect(resolveMap[6]).not.toBeDefined();
      })
      .then(() => {
        resolveMap[0]();
        resolveMap[1]();
        resolveMap[2]();
      })
      .then(() => sleep(30))
      .then(() => {
        expect(resolveMap[0]).toBeDefined();
        expect(resolveMap[1]).toBeDefined();
        expect(resolveMap[2]).toBeDefined();
        expect(resolveMap[3]).toBeDefined();
        expect(resolveMap[4]).toBeDefined();
        expect(resolveMap[5]).toBeDefined();
        expect(resolveMap[6]).not.toBeDefined();
      })
      .then(() => {
        resolveMap[3]();
        resolveMap[4]();
        resolveMap[5]();
      })
      .then(() => sleep(30))
      .then(() => {
        expect(resolveMap[0]).toBeDefined();
        expect(resolveMap[1]).toBeDefined();
        expect(resolveMap[2]).toBeDefined();
        expect(resolveMap[3]).toBeDefined();
        expect(resolveMap[4]).toBeDefined();
        expect(resolveMap[5]).toBeDefined();
        expect(resolveMap[6]).toBeDefined();
      })
      .then(() => {
        resolveMap[6]();
      });
  });

  it('should not loop if given "to" is the same as "from"', done => {
    const resolveMap = {};
    const cb = (idx: bigint) => new Promise(r => (resolveMap[idx.toString()] = r));
    loopInChunks(2n, 2n, 3n, cb).then(() => done());
    sleep(30)
      .then(() => expect(resolveMap[2]).toBeDefined())
      .then(() => resolveMap[2]());
  });
});
