import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({ example: 'yuunow', description: '사용자 이름' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: '1234', description: '비밀번호' })
    @IsString()
    @MinLength(4)
    password: string;
}