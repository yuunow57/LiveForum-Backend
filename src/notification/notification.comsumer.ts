import { Processor, WorkerHost } from "@nestjs/bullmq";
import { NotificationService } from "./notification.service";

@Processor('notification')
export class NotificationConsumer extends WorkerHost {
    constructor(private readonly notificationService: NotificationService) {
        super();
    }

    async process(job) {
        const data = job.data;
        console.log('알림 작업 처리중...', data);

        await this.notificationService.createNotification(
            data.user,
            data.type,
            data.message,
            data.targetId,
        );
    }
}