import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
    constructor (
        private readonly statsService: StatsService,
    ) {}

    @Public()
    @Get('daily')
    @ApiOperation({ summary: '일별 게시글/댓글/유저 통계 조회' })
    getDaily() {
        return this.statsService.getDailyStats();
    }
}
