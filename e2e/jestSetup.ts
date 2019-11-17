/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { registerScreenshotReporter } from './screenshooter';
const debug = process.env.DEBUG_E2E === 'true';

if (!debug) {
	registerScreenshotReporter();
}

require('./matchers');
