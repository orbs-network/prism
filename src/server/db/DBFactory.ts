/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { IDB } from './IDB';
import { InMemoryDB } from './InMemoryDB';
// import { PostgresDB } from './PostgresDB';
import { MongoDB } from './MongoDB';
import { POSTGRES_URL, MONGODB_URI, DATABASE_TYPE } from '../config';

export function genDb(): IDB {
  switch (DATABASE_TYPE) {
    case 'MONGO':
      return new MongoDB(MONGODB_URI);

    // case 'POSTGRES':
    //   return new PostgresDB(POSTGRES_URL);

    default:
      return new InMemoryDB();
  }
}
