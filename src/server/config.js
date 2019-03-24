/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

const findUp = require('find-up');
const dotEnvPath = findUp.sync('.env');
require('dotenv').config({ path: dotEnvPath });

module.exports = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  SERVER_PORT: process.env.PORT || 3000,
  POSTGRES_URL: process.env.POSTGRES_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_TYPE: process.env.DATABASE_TYPE,
  ORBS_ENDPOINT: process.env.ORBS_ENDPOINT,
  ORBS_VIRTUAL_CHAIN_ID: parseInt(process.env.ORBS_VIRTUAL_CHAIN_ID),
  ORBS_NETWORK_TYPE: process.env.ORBS_NETWORK_TYPE,
  POOLING_INTERVAL: parseInt(process.env.POOLING_INTERVAL),
  GAP_FILLER_INTERVAL: process.env.GAP_FILLER_INTERVAL ? parseInt(process.env.GAP_FILLER_INTERVAL) : 30,
};
