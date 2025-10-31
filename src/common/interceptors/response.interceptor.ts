import { 
    CallHandler, // 다음 단계(컨트롤러)로 넘기는 스위치
    ExecutionContext, // 현재 실제 상황에 접근할 수 있는 핸들
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> { // 요청을 가로채서 컨트롤러 전/후의 작업을 진행
        return next.handle().pipe(
            map((data) => ({
                success: true,
                data,
                timestamp: new Date().toISOString(),
            })),
        );
    }
}