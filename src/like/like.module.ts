import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Like } from './like.entity';
import { EventsGateway } from '../events/events.gateway';
import { User } from '../user/user.entity';
import { NotificationProducer } from '../notification/notification.producer';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like, User]), UserModule, QueueModule],
  providers: [LikeService, EventsGateway, NotificationProducer],
  controllers: [LikeController],
  exports: [LikeService]
})
export class LikeModule {}
