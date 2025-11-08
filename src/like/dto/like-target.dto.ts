import { IsInt, IsIn, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LikeTargetDto {
    @ApiProperty({ example: 2, description: '대상 ID(게시글 또는 댓글)' })
    @IsInt()
    @IsNotEmpty()
    targetId: number;

    @ApiProperty({ example: 'post', description: '대상 유형(post 또는 comment)' })
    @IsIn(['post', 'comment'], { message: 'targetType은 post 또는 comment만 허용' })
    @IsNotEmpty()
    targetType: 'post' | 'comment';
}