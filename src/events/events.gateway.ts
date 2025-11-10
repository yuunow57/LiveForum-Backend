import { 
  SubscribeMessage, 
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
 } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // 모든 도메인 허용, 배포 시 도메인 변경
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log(`Received ping:`, data);
    client.emit('pong', { message: 'pong from server' });
  }

  @SubscribeMessage('comment_added')
  handleCommentAdded(@MessageBody() payload: any) {
    console.log(`Comment event received:`, payload);
    this.server.emit('comment_broadcast', payload);
  }
}
