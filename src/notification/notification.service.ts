import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
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

    findAllByUser(userId: number) {
        return this.notificationRepository.find({
            where: { author: { id: userId }},
            order: { createAt: 'DESC' },
        });
    }
}
