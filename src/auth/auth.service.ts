import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // POST /auth/register
    async register(dto: CreateUserDto) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(dto.password, salt);
        dto.password = hashedPassword;
        const newUser = await this.userService.create(dto);
        return { message: '회원가입 성공', user: newUser };
    }

    // POST /auth/access
    private generateAccessToken(user) {
        return this.jwtService.signAsync({ sub: user.id, email: user.email }, { expiresIn: '1h' });
    }

    // POST /auth/refresh
    private generateRefreshToken(user) {
        return this.jwtService.signAsync({ sub: user.id }, { expiresIn: '14d' });
    }

    // POST /auth/login
    async login(dto: LoginUserDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('존재하지 않는 사용자입니다.'); // 인증 실패 시 401 상태 응답

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('올바르지 않은 비밀번호 입니다.');

        const accessToken = await this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);

        await this.userRepository.update(user.id, { refreshToken });
        return {
            message: '로그인 성공',
            accessToken,
            refreshToken,
        };
    }
}
