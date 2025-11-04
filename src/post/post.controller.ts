import { Controller, Body, Param, Post, Get, Delete, Req, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { UserService } from '../user/user.service';
import { BoardService } from '../board/board.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Post')
@Controller('posts')
export class PostController {
    constructor (
        private readonly postService: PostService,
        private readonly userService: UserService,
        private readonly boardService: BoardService,
    ) {}

    @Public()
    @Get()
    @ApiOperation({ summary: '게시글 목록 조회' })
    @ApiResponse({ status:200, description: '게시글 목록 반환' })
    findAll() {
        return this.postService.findAll();
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: '게시글 상세 조회' })
    @ApiResponse({ status:200, description: '특정 게시글 반환' })
    findOne(@Param('id') id: number) {
        return this.postService.findOne(id);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '게시글 작성 (로그인 필요)' })
    async create(@Req() req, @Body() body: { title: string, content: string, boardId: number }) {
        const user = await this.userService.findOne(req.user.userId);
        if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.'); // create()에 요소로 들어갈 user가 Null일 가능성을 없앰

        const board = await this.boardService.findOne(body.boardId);
        return this.postService.create(body.title, body.content, user, board);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '게시글 삭제 (작성자 전용)' })
    remove(@Param('id') id: number) {
        return this.postService.remove(id);
    }
}
