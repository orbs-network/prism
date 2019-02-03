import { IBlock } from '../shared/IBlock';
import { WS } from './ws/ws';

export class Storage {
  constructor(private ws: WS) {}

  public StoreBlock(newBlock: IBlock): void {
    this.ws.emit('new-block', newBlock);
  }
}
