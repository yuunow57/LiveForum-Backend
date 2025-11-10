import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from '../common/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth') // Swagger 카테고리 이름
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Public()
    @Post('register')
    @ApiOperation({ summary: '회원가입', description: '새로운 사용자를 등록합니다.' })
    @ApiResponse({ status: 201, description: '회원가입 성공' })
    register(@Body() dto: CreateUserDto) {
        return this.authService.register(dto);
    }

    @Public()
    @Post('login')
    @ApiOperation({ summary: '로그인', description: 'JWT 토큰을 발급받습니다.' })
    @ApiResponse({ status: 200, description: '로그인 성공, JWT 토큰 반환' })
    login(@Body() dto: LoginUserDto) {
        return this.authService.login(dto);
    }
}
