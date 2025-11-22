import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { EventsGateway } from '../events/events.gateway';
import { QueueModule } from '../queue/queue.module';
import { NotificationConsumer } from './notification.comsumer';
import { NotificationProducer } from './notification.producer';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), QueueModule],
  providers: [NotificationService, NotificationConsumer, NotificationProducer, EventsGateway],
  controllers: [NotificationController],
  exports: [NotificationService, NotificationProducer],
})
export class NotificationModule {}
