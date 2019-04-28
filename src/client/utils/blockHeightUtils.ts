/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

// because we're using string blockHeight (avoiding BigInt polyfill)
// we have to work around it. In the future we should support BigInt
const toNum = (val: string | number): number => (typeof val === 'number' ? val : parseInt(val, 10));

export const add = (a: string | number, b: string | number): number => toNum(a) + toNum(b);
export const subtract = (a: string | number, b: string | number): number => toNum(a) - toNum(b);

export const calcNextBlock = (blockHeight: string): string => add(blockHeight, 1).toString();
export const calcPrevBlock = (blockHeight: string): string => subtract(blockHeight, 1).toString();
