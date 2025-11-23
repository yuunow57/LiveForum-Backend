import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { Comment } from './comment.entity';
import { EventsGateway } from '../events/events.gateway';
import { QueueModule } from '../queue/queue.module';
import { NotificationProducer } from '../notification/notification.producer';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UserModule, PostModule, QueueModule],
  providers: [CommentService, EventsGateway, NotificationProducer],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
