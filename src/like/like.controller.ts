import { Controller, Body, Post, Get, Req, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LikeService } from './like.service';
import { UserService } from '../user/user.service';
import { Public } from '../common/decorators/public.decorator';
import { LikeTargetDto } from './dto/like-target.dto';

@ApiTags('Like')
@Controller('likes')
export class LikeController {
    constructor (
        private readonly likeService: LikeService,
        private readonly userSerivce: UserService
    ) {}

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '좋아요 토글 (Post/Comment 공용)' })
    @ApiResponse({ status:200, description: '좋아요 상태 변경 결과 반환' })
    @Post()
    async toggle(@Req() req, @Body() dto: LikeTargetDto ) {
        const user = await this.userSerivce.findOne(req.user.userId);
        if (!user) throw new NotFoundException('존재하지 않는 회원 입니다.');
        return this.likeService.toggleLike(user, dto)
    }

    @Public()
    @Post('count')
    @ApiOperation({ summary: '대상별 좋아요 개수 조회' })
    async count(@Body() dto: LikeTargetDto) {
        const count = await this.likeService.countLikes(dto);
        return { targetId: dto.targetId, targetType: dto.targetType, count };
    }
}
