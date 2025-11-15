import { Controller, Get, Req, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationService } from './notification.service';

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
    constructor (
        private readonly notificationService: NotificationService,
    ) {}

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '내 알림 목록 조회' })
    @Get()
    async findMyNotifications(@Req() req) {
        const userId = req.user.userId;
        return this.notificationService.findAllByUser(userId);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '읽지 않은 알림 개수 조회' })
    @Get('unread-count')
    async findUnreadCount(@Req() req) {
        const userId = req.user.userId;
        const count = await this.notificationService.findUnreadCount(userId);
        return { unreadCount: count };
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '알림 읽음 처리' })
    @Patch(':id/read')
    async markAsRead(@Param('id') id: number, @Req() req) {
        const userId = req.user.userId;
        return this.notificationService.markAsRead(id, userId);
    }
}
