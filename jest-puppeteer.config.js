/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

const debug = process.env.DEBUG_E2E === 'true';

module.exports = {
  launch: {
    headless: !debug,
    args: ['--no-sandbox', '--disable-setuid-sandbox' ]
  },
  server: {
    command: 'npm run start:prod',
    port: 3000,
    debug,
  },
};
