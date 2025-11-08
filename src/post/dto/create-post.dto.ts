import { IsString, IsNotEmpty, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({ example: '컴퓨터 과학1', description: '게시글 제목' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: '컴퓨터 과학은 심오하다', description: '게시글 내용' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: 2, description: '게시판 ID' })
    @IsNumber()
    @IsNotEmpty()
    boardId: number;
}