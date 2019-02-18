const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

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
        this.port,
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
      const { stdout, stderr } = await execFile('gamma-cli', ['stop-local', 'experimental', '-port', this.port]);
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
