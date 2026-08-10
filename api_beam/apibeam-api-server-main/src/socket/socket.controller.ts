import { Controller, Get, Param, Query } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Controller('connect')
export class SocketController {
  constructor(private readonly gateway: SocketGateway) {}

  @Get(':roomId')
  connectUser(
    @Param('roomId') roomId: string,
    @Query('socketId') socketId: string,
  ) {
    const client = this.gateway.server.sockets.sockets.get(socketId);

    if (!client) {
      return { success: false, message: 'Invalid socketId' };
    }

    this.gateway.joinRoom(client, roomId);

    return {
      success: true,
      joined: roomId,
      socketId,
    };
  }
}
