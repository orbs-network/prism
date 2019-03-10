import { MockOrbsAdapter } from './MockOrbsAdapter';

export class EmittingBlocksOrbsAdapter extends MockOrbsAdapter {
  private blocksGeneratorIntervalId: NodeJS.Timeout;

  public async init(): Promise<void> {
    this.generateBlocks();
  }

  public dispose(): void {
    if (this.blocksGeneratorIntervalId) {
      clearInterval(this.blocksGeneratorIntervalId);
    }
    super.dispose();
  }

  private generateBlocks() {
    this.blocksGeneratorIntervalId = setInterval(() => this.emitNewBlock(), 1500);
  }
}
