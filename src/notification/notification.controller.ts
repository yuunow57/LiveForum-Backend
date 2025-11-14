import { Controller, Get, Req } from '@nestjs/common';
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
}
