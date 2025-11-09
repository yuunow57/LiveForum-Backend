import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
    @ApiProperty({ example: '유노', description: '사용자 이름' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'yuunow57@gmail.com', description: '사용자 이메일' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '1234', description: '비밀번호' })
    @IsString()
    @MinLength(4)
    password: string;
}