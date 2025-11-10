import { IsString, IsInt, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty({ example: '유익한 내용', description: '댓글 내용' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: 2, description: '게시글 ID' })
    @IsInt()
    @IsNotEmpty()
    postId: number;
}