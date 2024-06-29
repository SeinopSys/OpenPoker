import { Logger } from '@nestjs/common';
import { OnGatewayInit, WebSocketGateway } from '@nestjs/websockets';
import sharedSession from 'express-socket.io-session';
import { Server } from 'socket.io';
import { createSessionMiddleware } from './utils/session-middleware';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit {
  private readonly logger = new Logger();

  async afterInit(server: Server) {
    const sessionMiddleware = await createSessionMiddleware(this.logger);
    server.engine.use(sessionMiddleware);
    server.use(sharedSession(sessionMiddleware));
    this.logger.log('Registered session middleware on Gateway');
  }
}
