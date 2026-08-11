import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { GatewayTimeoutException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { socketCorsOrigin } from '../config/cors';

// ChatGPT image generation commonly takes longer than a normal text reply.
// Keep the HTTP request open long enough for the extension to capture the
// finished image, while still preventing a lost browser tab from hanging it.
const REQUEST_TIMEOUT_MS = 3 * 60 * 1000;

@WebSocketGateway({
  // Inline generated-image previews are capped in the extension. Give their
  // Socket.IO response room without accepting arbitrarily large payloads.
  maxHttpBufferSize: 2_000_000,
  cors: {
    origin: socketCorsOrigin,
    credentials: true,
  },
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  private pendingResponses = new Map<string, (msg: any) => void>();
  private pendingTimeouts = new Map<string, NodeJS.Timeout>();

  /**
   * HTTP Route calls this to emit message and wait for response
   */
  async sendToRoomAndWait(roomId: string, message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Save resolver so WS response can resolve this HTTP request
      this.pendingResponses.set(roomId, resolve);

      const timeout = setTimeout(() => {
        if (this.pendingResponses.has(roomId)) {
          this.pendingResponses.delete(roomId);
          this.pendingTimeouts.delete(roomId);
          console.log('api timeout');
          reject(
            new GatewayTimeoutException(
              `Request timed out. The ChatGPT tab opened by the extension may have been closed or is no longer available. Please reopen the tab and try again.
              Please watch this video for help you are very close to getting it working:
              https://github.com/niteshSingh17/apibeam/#apibeam`,
            ),
          );
        }
      }, REQUEST_TIMEOUT_MS);

      // Emit event to room
      this.server.to(roomId).emit('serverMessage', message);
      this.pendingTimeouts.set(roomId, timeout);
    });
  }

  /**
   * Client responds from room → resolve the pending HTTP request
   */
  @SubscribeMessage('clientResponse')
  handleClientResponse(@MessageBody() data: { roomId: string; message: any }) {
    const { roomId, message } = data;
    const resolver = this.pendingResponses.get(roomId);
    const timeout = this.pendingTimeouts.get(roomId);
    if (timeout) {
      clearTimeout(timeout);
      this.pendingTimeouts.delete(roomId);
    }
    if (resolver) {
      resolver(message); // Fulfill HTTP request
      this.pendingResponses.delete(roomId);
    }
  }

  // When API tells user to join room
  joinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    console.log(`Client ${client.id} joined room: ${roomId}`);
    this.server.to(roomId).emit('roomJoined', { roomId });
  }

  // Socket connected
  handleConnection(socket: Socket) {
    console.log('Client connected:', socket.id);
  }

  // Socket disconnected
  handleDisconnect(socket: Socket) {
    console.log('Client disconnected:', socket.id);
  }
}
