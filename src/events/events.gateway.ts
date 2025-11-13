import { 
  SubscribeMessage, 
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
 } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // 모든 도메인 허용, 배포 시 도메인 변경
  },  
  namespace: '/ws', // /ws 네임스페이스 추가
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

  // @SubscribeMessage('comment_added')
  // handleCommentAdded(@MessageBody() payload: any) {
  //   console.log(`Comment event received:`, payload);
  //   this.server.emit('comment_broadcast', payload);
  // }

  @SubscribeMessage('join_post')
  handleJoinPost(@MessageBody() data: { postId: number }, @ConnectedSocket() client: Socket) {
    const room = `post:${data.postId}`;
    client.join(room);
    console.log(`Client ${client.id} joined ${room}`);
    client.emit('joined_post', { room });
  }

  @SubscribeMessage('leave_post')
  handleLeavePost(@MessageBody() data: { postId: number }, @ConnectedSocket() client: Socket) {
    const room = `post:${data.postId}`;
    client.leave(room);
    console.log(`Client ${client.id} left ${room}`);
  }

  emitCommentAdded(postId: number, comment: any) {
    const room = `post:${postId}`;
    this.server.to(room).emit('comment_added', comment);
    console.log(`Broadcast comment to ${room}`);
  }

  emitLikeToggled(targetType: 'post' | 'comment', targetId: number, likeCount: number) {
    const event = targetType === 'post' ? 'post_liked' : 'comment_liked';
    const payload = { targetId, likeCount };
    this.server.emit(event, payload);
    console.log(`${event} broadcast ->`, payload);
  }
}
