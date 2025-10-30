import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    // POST /auth/register
    async register(dto: CreateUserDto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        const newUser = await this.userService.create(dto.username, hashedPassword);
        return { message: '회원가입 성공', user: newUser };
    }

    // POST /auth/login
    async login(dto: LoginUserDto) {
        const user = await this.userService.findByUsername(dto.username);
        if (!user) throw new UnauthorizedException('존재하지 않는 사용자입니다.'); // 인증 실패 시 401 상태 응답

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('올바르지 않은 비밀번호 입니다.');

        const payload = { sub: user.id, username: user.username }; // 토큰에 담을 내용물
        const token = await this.jwtService.signAsync(payload); // 토큰 생성
        return { message: '로그인 성공', accessToken: token };
    }
}
