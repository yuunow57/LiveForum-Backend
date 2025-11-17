import { ArgumentsHost, Catch } from "@nestjs/common";
import { BaseWsExceptionFilter } from "@nestjs/websockets";

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToWs();
        const client = ctx.getClient();
        const errorMsg =
            exception.message || '알 수 없는 WebSocket 오류입니다.';
        console.error('WebSocket Exception:', errorMsg);
        client.emit('error', { message: errorMsg });
    }
}