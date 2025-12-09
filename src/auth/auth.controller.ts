import { Controller, Body, Post, UnauthorizedException, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from '../common/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@ApiTags('Auth') // Swagger 카테고리 이름
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
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
    
    @Public()
    @Post('refresh')
    @ApiOperation({ summary: '토큰 재발급', description: 'Refresh Token을 사용하여 토큰 재발급' })
    @ApiResponse({ status: 200, description: '새로운 토큰 발급 성공' })
    async refresh(@Body('refreshToken') token: string) {
        const decoded = this.jwtService.verify(token);
        
        const user = await this.userService.findOne(decoded.sub);
        if (!user) throw new UnauthorizedException('유효하지 않은 토큰입니다.');

        if (user.refreshToken !== token) {
            throw new UnauthorizedException('Refresh Token 불일치');
        }

        const newAccessToken = await this.jwtService.signAsync(
            { sub: user.id, email: user.email },
            { expiresIn: '1h' }
        );

        return { accessToken: newAccessToken };
    }

    @Get('me')
    async me(@Req() req) {
        return {
            success: true,
            data: req.user,
        };
    }
}
