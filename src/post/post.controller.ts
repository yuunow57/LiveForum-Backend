import { Controller, Body, Param, Post, Get, Patch, Delete, Req, NotFoundException, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PostService } from './post.service';
import { UserService } from '../user/user.service';
import { BoardService } from '../board/board.service';
import { Public } from '../common/decorators/public.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

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
    async findOne(@Param('id') id: number) {
        await this.postService.updateViewCount(id);
        return this.postService.findOne(id);
    }

    @Post()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '게시글 작성 (로그인 필요)' })
    @UseInterceptors(FilesInterceptor('images', 10))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
        type: 'object',
        properties: {
            boardId: { type: 'number' },
            title: { type: 'string' },
            content: { type: 'string' },
            images: {
            type: 'array',
            items: { type: 'string', format: 'binary' },
            },
        },
        },
    })
    async create(
        @Req() req,
        @Body() dto: CreatePostDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const user = await this.userService.findOne(req.user.userId);
        if (!user) throw new NotFoundException('존재하지 않는 회원 입니다.');
        const board = await this.boardService.findOne(dto.boardId);
        return this.postService.create(dto, user, board, files);
    }

    @Patch(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '게시글 수정 (작성자 전용)' })
    @UseInterceptors(FilesInterceptor('images', 10))
    @ApiConsumes('multipart/form-data')
    async update(
        @Param('id') id: number,
        @Req() req,
        @Body() dto: UpdatePostDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const userId = req.user.id;
        return this.postService.update(id, userId, dto, files);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '게시글 삭제 (작성자 전용)' })
    remove(@Param('id') id: number) {
        return this.postService.remove(id);
    }
}
