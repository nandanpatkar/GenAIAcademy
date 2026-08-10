import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [],
  controllers: [SocketController],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
