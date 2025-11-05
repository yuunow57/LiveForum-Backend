import { Controller, Body, Param, Post, Get, Delete, Req, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Comment')
@Controller('comments')
export class CommentController {
    constructor (
        private readonly commentService: CommentService,
        private readonly userService: UserService,
        private readonly postService: PostService,
    ) {}

    @Public()
    @Get(':id')
    @ApiOperation({ summary: '게시글의 댓글 목록 조회' })
    @ApiResponse({ status: 200, description: '댓글 목록 반환' })
    findAllByPost(@Param('id') id: number) {
        return this.commentService.findAllByPost(id);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '댓글 작성 (로그인 필요)' })
    async create(@Req() req, @Body() body: { content: string, postId: number }) {
        const user = await this.userService.findOne(req.user.userId);
        if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
        const post = await this.postService.findOne(body.postId);
        return this.commentService.create(body.content, user, post);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '댓글 삭제 (작성자 전용)' })
    remove(@Param('id') id: number) {
        return this.commentService.remove(id);
    }
}
