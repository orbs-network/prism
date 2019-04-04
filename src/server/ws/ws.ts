/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Server } from 'http';
import * as socketIO from 'socket.io';
import { IBlockSummary } from '../../shared/IBlock';
import { INewBlocksHandler } from '../orbs-adapter/OrbsAdapter';
import { IRawBlock } from '../../shared/IRawData';
import { rawBlockToBlockSummary } from '../block-transform/blockTransform';

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
    this.emit('new-block-summary', rawBlockToBlockSummary(rawBlock));
  }

  private emit(name: string, data: any) {
    Object.keys(this.sockets)
      .map(id => this.sockets[id])
      .forEach(s => s.emit(name, data));
  }
}
