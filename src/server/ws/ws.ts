/**
 * Copyright 2019 the prism authors
 * This file is part of the prism library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

import { Server } from 'http';
import { INewBlocksHandler } from 'orbs-blocks-polling-js';
import { GetBlockResponse } from 'orbs-client-sdk/dist/codec/OpGetBlock';
import * as socketIO from 'socket.io';
import * as winston from 'winston';
import { blockResponseToBlockSummary } from '../transformers/blockTransform';

export class WS implements INewBlocksHandler {
  private sockets = {};

  constructor(private logger: winston.Logger, private server: Server) {
    const io = socketIO(this.server);

    io.on('connection', socket => {
      this.sockets[socket.id] = socket;
      this.logger.info(`Client connected, ${Object.keys(this.sockets).length} websockets connections`);
      socket.on('disconnect', () => {
        delete this.sockets[socket.id];
        this.logger.info(`Client disconnected, ${Object.keys(this.sockets).length} websockets connections.`);
      });
    });
  }

  public async handleNewBlock(block: GetBlockResponse): Promise<void> {
    this.emit('new-block-summary', blockResponseToBlockSummary(block));
  }

  private emit(name: string, data: any) {
    Object.keys(this.sockets)
      .map(id => this.sockets[id])
      .forEach(s => s.emit(name, data));
  }
}
