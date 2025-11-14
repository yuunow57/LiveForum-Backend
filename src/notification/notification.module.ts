import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { EventsGateway } from '../events/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationService, EventsGateway],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
