import { Controller, Body, Post, Get, Delete, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Board')
@Controller('boards')
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @Public()
    @Get()
    @ApiOperation({ summary: '게시판 목록 조회' }) // Swagger설명문
    @ApiResponse({ status: 200, description: '게시판 목록 반환' }) // Swagger응답문
    findAll() {
        return this.boardService.findAll();
    } 

    @Public()
    @Get(':id')
    @ApiOperation({ summary: '게시판 상세 조회' })
    @ApiResponse({ status: 200, description: '게시판 정보 반환' })
    findOne(@Param('id') id: number) {
        return this.boardService.findOne(id);
    }

    @Post()
    @ApiBearerAuth('access-token') // Swagger토큰
    @ApiOperation({ summary: '게시판 생성 (관리자 전용)' })
    create(@Body() body: {name: string, description?: string}) {
        return this.boardService.create(body.name, body.description);
    }

    @Delete(':id')
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: '게시판 삭제 (관리자 전용' })
    remove(@Param('id') id: number) {
        return this.boardService.remove(id);
    }
}
