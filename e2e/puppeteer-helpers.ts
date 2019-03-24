/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Evalable } from 'puppeteer';

export const pauseFor = (timeout: number): Promise<void> => new Promise(resolve => setTimeout(resolve, timeout));
export const getElementText = async (selector: string, parent: Evalable = page) =>
  await parent.$eval(`${selector}`, (el: HTMLElement) => el.innerText);

export async function waitUntil(
  predicate: () => Promise<boolean>,
  timeout: number = 20_000,
  interval: number = 1_000,
): Promise<void> {
  const endTime = Date.now() + timeout;
  while (endTime > Date.now()) {
    if (await predicate()) {
      return;
    }

    await pauseFor(interval);
  }

  throw new Error('waitUtil reached timeout');
}
