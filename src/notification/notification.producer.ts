import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationProducer {
    constructor(
        @InjectQueue('notification')
        private readonly notificationQueue: Queue,
    ) {}

    async enqueueNotification(data: any) {
        await this.notificationQueue.add('send', data, {
            removeOnComplete: true,
            removeOnFail: false,
        });
        console.log('큐에 알림 작업 등록:', data);
    }
}