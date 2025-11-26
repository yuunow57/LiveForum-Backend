import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from '../user/user.entity';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        private readonly eventsGateway: EventsGateway,
    ) {}

    // 외부 로직 
    async createNotification(user: User, type: 'comment' | 'like', message: string, targetId: number) {
        const notification = this.notificationRepository.create({
            author: user,
            type,
            message,
            targetId
        });
        const saved = await this.notificationRepository.save(notification);

        this.eventsGateway.emitUserNotification(user.id, {
            id: saved.id,
            type,
            message,
            targetId,
            createAt: saved.createAt,
        });
        
        return saved;
    }

    // GET /notifications
    findAllByUser(userId: number) {
        return this.notificationRepository.find({
            where: { author: { id: userId }},
            order: { createAt: 'DESC' },
        });
    }

    // GET /notifications/unread-count
    async findUnreadCount(userId: number) {
        return this.notificationRepository.count({
            where: { author: { id: userId }, isRead: false },
        });
    }

    // Patch /notifications/:id/read
    async markAsRead(id: number, userId: number) {
        const notification = await this.notificationRepository.findOne({
            where: { id, author: { id: userId } },
        });
        if (!notification) throw new NotFoundException('알림을 찾을 수 없습니다.');

        notification.isRead = true;
        const updated = await this.notificationRepository.save(notification);

        // 실시간 읽음 알림 전송
        this.eventsGateway.emitNotificationRead(userId, notification.id);

        return updated;
    }
}
