import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoardDto {
    @ApiProperty({ example: '새 게시판 이름', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: '업데이트된 설명입니다.', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}