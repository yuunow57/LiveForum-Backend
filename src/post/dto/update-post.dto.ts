import { IsString, IsOptional, IsInt, IsArray } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdatePostDto {
    @ApiPropertyOptional({ example: '새 게시글 제목' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: '수정된 게시글 내용입니다.' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({ example: [1, 2, 3], description: '유지할 기존 이미지 ID 배열' })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    keepImageIds?: number[];
}