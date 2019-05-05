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

const { version } = require(findUp.sync('package.json'));

////////////// CONFIG VARIABLES //////////////
const PRISM_VERSION = `v${version}`;

// environment
const IS_DEV = process.env.NODE_ENV !== 'production';

// debug
const MINIFY_JS_FILES = process.env.MINIFY_JS_FILES === 'true';
const LOG_TO_CONSOLE = process.env.LOG_TO_CONSOLE === 'true';
const LOG_TO_FILE = process.env.LOG_TO_FILE === 'true';
const LOG_TO_ROLLBAR = process.env.LOG_TO_ROLLBAR === 'true';

// server
const SERVER_PORT = process.env.PORT || 3000;
const WEBPACK_PORT = 8085; // For dev environment only
const FORCE_HTTPS = process.env.FORCE_HTTPS === 'true';

// analytics
const ROLLBAR_ACCESS_TOKEN_SERVER = process.env.ROLLBAR_ACCESS_TOKEN_SERVER;

// database
const DATABASE_TYPE = process.env.DATABASE_TYPE;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_IS_READ_ONLY = process.env.DB_IS_READ_ONLY === 'true';

// orbs client
const ORBS_ENDPOINT = process.env.ORBS_ENDPOINT;
const ORBS_VIRTUAL_CHAIN_ID = parseInt(process.env.ORBS_VIRTUAL_CHAIN_ID);
const ORBS_NETWORK_TYPE = process.env.ORBS_NETWORK_TYPE;

// polling
const POOLING_INTERVAL = parseInt(process.env.POOLING_INTERVAL);

// gap filler
const GAP_FILLER_ACTIVE = process.env.GAP_FILLER_ACTIVE === 'true';
const GAP_FILLER_INTERVAL = parseInt(process.env.GAP_FILLER_INTERVAL_IN_MINUTES) * 60 * 1000;

module.exports = {
  PRISM_VERSION,
  IS_DEV,
  MINIFY_JS_FILES,
  LOG_TO_CONSOLE,
  LOG_TO_FILE,
  LOG_TO_ROLLBAR,
  ROLLBAR_ACCESS_TOKEN_SERVER,
  SERVER_PORT,
  FORCE_HTTPS,
  WEBPACK_PORT,
  DATABASE_TYPE,
  MONGODB_URI,
  ORBS_ENDPOINT,
  ORBS_VIRTUAL_CHAIN_ID,
  ORBS_NETWORK_TYPE,
  POOLING_INTERVAL,
  DB_IS_READ_ONLY,
  GAP_FILLER_ACTIVE,
  GAP_FILLER_INTERVAL,
};
