/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

expect.extend({
  toHaveAscendingValues: values => {
    let pass = true;
    for (let i = 0; i < values.length - 1; i++) {
      pass = pass && values[i] === values[i + 1] - 1;
    }

    if (pass) {
      return {
        message: () => `expected ${values} to not have ascending values`,
        pass,
      };
    } else {
      return {
        message: () => `expected ${values} to have ascending values`,
        pass,
      };
    }
  },
});
