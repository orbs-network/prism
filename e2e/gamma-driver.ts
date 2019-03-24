/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import util from 'util';
import processChild from 'child_process';
const execFile = util.promisify(processChild.execFile);

export class GammaDriver {
  constructor(private endpoint: string, private port: number) {}

  public async start() {
    try {
      const { stdout, stderr } = await execFile('gamma-cli', [
        'start-local',
        '-wait',
        '-env',
        'experimental',
        '-port',
        this.port.toString(),
      ]);
      console.log(stdout);
      if (stderr) {
        console.error(stderr);
      }
    } catch (e) {
      console.error('Unable to run start gamma-cli');
    }
  }

  public async stop() {
    try {
      const { stdout, stderr } = await execFile('gamma-cli', [
        'stop-local',
        'experimental',
        '-port',
        this.port.toString(),
      ]);
      console.log(stdout);
      if (stderr) {
        console.error(stderr);
      }
    } catch (e) {
      console.error('Unable to run stop gamma-cli');
    }
  }

  public getEndPoint(): string {
    return `http://${this.endpoint}:${this.port}`;
  }
}
