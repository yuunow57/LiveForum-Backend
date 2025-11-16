import { IoAdapter } from "@nestjs/platform-socket.io";
import { INestApplication, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ServerOptions } from "socket.io";

export class JwtSocketAdapter extends IoAdapter {
    private jwtService: JwtService;

    constructor(app: INestApplication) {
        super(app);
        this.jwtService = app.get(JwtService);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const server = super.createIOServer(port, {
            cors: { origin: '*' },
            ...options,
        });

        // 연결 시 JWT 토큰 검증
        server.use((socket, next) => {
            try {
                const token = socket.handshake.auth?.token || socket.handshake.headers['authorization'];

                if (!token) throw new UnauthorizedException('토큰이 없습니다.');
                const pureToken = token.replace('Bearer ', '');

                const payload = this.jwtService.verify(pureToken);
                socket.data.user = payload;
                next();
            } catch (err) {
                console.log('WebSocket 인증 실패: ', err.message);
                next(new UnauthorizedException('JWT 검증 실패'));
            }
        });

        return server;
    }
}