import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ example: 'yuunow', description: '사용자 이름' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: '1234', description: '비밀번호' })
    @IsString()
    @IsNotEmpty()
    password: string;
}