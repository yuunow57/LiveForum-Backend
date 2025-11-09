import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({ example: 'yuunow57@gmail.com', description: '사용자 이메일' })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '1234', description: '비밀번호' })
    @IsString()
    @IsNotEmpty()
    password: string;
}