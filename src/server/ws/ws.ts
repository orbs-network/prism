import { Server } from 'http';
import * as socketIO from 'socket.io';
import { IBlockSummary } from '../../shared/IBlock';
import { INewBlocksHandler, IRawBlock } from '../orbs-adapter/IOrbsAdapter';

export class WS implements INewBlocksHandler {
  private sockets = {};

  constructor(private server: Server) {
    const io = socketIO(this.server);

    io.on('connection', socket => {
      this.sockets[socket.id] = socket;
      console.log(`Client connected, ${Object.keys(this.sockets).length} connections`);
      socket.on('disconnect', () => {
        delete this.sockets[socket.id];
        console.log(`Client disconnected, ${Object.keys(this.sockets).length} connections.`);
      });
    });
  }

  public async handleNewBlock(rawBlock: IRawBlock): Promise<void> {
    this.emit('new-block-summary', this.blockToBlockSummary(rawBlock));
  }

  private emit(name: string, data: any) {
    Object.keys(this.sockets)
      .map(id => this.sockets[id])
      .forEach(s => s.emit(name, data));
  }

  private blockToBlockSummary(rawBlock: IRawBlock): IBlockSummary {
    return {
      blockHash: rawBlock.blockHash,
      blockHeight: rawBlock.blockHeight,
      numTransactions: rawBlock.transactions.length,
      blockTimestamp: rawBlock.timeStamp,
    };
  }
}
