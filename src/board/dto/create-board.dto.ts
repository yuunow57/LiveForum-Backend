import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBoardDto {
    @ApiProperty({ example: '컴퓨터 과학', description: '게시판 이름' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '컴퓨터 과학에 대한 이야기를 나누는 게시판', description: '게시판 설명' })
    @IsString()
    description?: string;
}