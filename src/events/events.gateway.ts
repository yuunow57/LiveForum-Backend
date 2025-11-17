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
import { WsExceptionFilter } from '../common/filters/ws-exception.filter';
import { UseFilters } from '@nestjs/common';

@UseFilters(new WsExceptionFilter())
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
    const user = client.data.user;
    if (!user) {
      console.log(' 비인증 소켓 연결 거부됨');
      client.disconnect();
      return;
    }

    const room = `user:${user.userId}`;
    client.join(room);
    console.log(`${user.username} (${user.userId}) connected to ${room}`);
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user
    if (user) console.log(`${user.username} (${user.userId}) disconnected`);
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

  /* -- 게시글 룸  -- */
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
  /* -- 게시글 룸 -- */
  
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

  // @SubscribeMessage('join_user')
  // handleJoinUser(@MessageBody() data: { userId: number }, @ConnectedSocket() client: Socket) {
  //   const room = `user:${data.userId}`;
  //   client.join(room);
  //   console.log(`User ${data.userId} join their notification room`);
  // }
  
  // 개별 사용자 알림 푸시
  emitUserNotification(userId: number, payload: any) {
    const room = `user:${userId}`;
    this.server.to(room).emit('notify_user', payload);
    console.log(`notify_user -> ${room}`, payload)
  }

  // 알림 읽음 이벤트
  emitNotificationRead(userId: number, notificationId: number) {
    const room = `user:${userId}`;
    this.server.to(room).emit(`notification_read`, { notificationId });
    console.log(`notification_read -> ${room} | ${notificationId}`);
  }
}
