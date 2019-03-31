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

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_STAGING = process.env.NODE_ENV === 'staging';
module.exports = {
  IS_PRODUCTION,
  IS_STAGING,
  IS_DEV: !IS_PRODUCTION && !IS_STAGING,
  SERVER_PORT: process.env.PORT || 3000,
  WEBPACK_PORT: 8080,
  POSTGRES_URL: process.env.POSTGRES_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_TYPE: process.env.DATABASE_TYPE,
  ORBS_ENDPOINT: process.env.ORBS_ENDPOINT,
  ORBS_VIRTUAL_CHAIN_ID: parseInt(process.env.ORBS_VIRTUAL_CHAIN_ID),
  ORBS_NETWORK_TYPE: process.env.ORBS_NETWORK_TYPE ? process.env.ORBS_NETWORK_TYPE : 'TEST_NET',
  POOLING_INTERVAL: process.env.POOLING_INTERVAL ? parseInt(process.env.POOLING_INTERVAL) : 1000,
  DB_IS_READ_ONLY: process.env.DB_IS_READ_ONLY === 'true',
  GAP_FILLER_ACTIVE: process.env.GAP_FILLER_ACTIVE === 'true',
  GAP_FILLER_INTERVAL: process.env.GAP_FILLER_INTERVAL ? parseInt(process.env.GAP_FILLER_INTERVAL) : 30,
  GAP_FILLER_INITIAL_DELAY: process.env.GAP_FILLER_INITIAL_DELAY
    ? parseInt(process.env.GAP_FILLER_INITIAL_DELAY)
    : 60 * 1000,
};
