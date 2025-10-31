import { 
    ExceptionFilter, // Nest의 에러처리를 담당하는 인터페이스
    Catch, // 해당클래스는 이 내용을 처리한다는 데코레이터
    ArgumentsHost, // 현재 실행중인 환경을 담는 객체
    HttpException, // 400, 401, 404, 500 에러상태 신호
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const message = exception.getResponse();

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}