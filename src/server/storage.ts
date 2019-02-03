import { OrbsAdaper } from './orbs-adapter';
import { WS } from './ws/ws';
import { IBlock } from '../shared/IBlock';

export class Storage {
  constructor(private orbsAdapter: OrbsAdaper, private ws: WS) {
    this.listenToNewBlocks();
  }

  private listenToNewBlocks(): void {
    this.orbsAdapter.RegisterToNewBlocks(block => this.onNewBlock(block));
  }

  private onNewBlock(newBlock: IBlock): void {
    this.ws.emit('new-block', newBlock);
  }
}
