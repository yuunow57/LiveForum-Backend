import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtSocketAdapter } from './events/ws.dapter';
import { UserService } from './user/user.service';
import { BoardService } from './board/board.service';
import { PostService } from './post/post.service';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO에 정의되지 않은 값을 무시
    forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 있으면 에러 발생
    transform: true // 요청값을 DTO 클래스 인스턴스로 변환
  }));

  app.enableCors({
    origin: ['http://localhost:5173',],
    credentials: true,
    methods: 'GET,POST,PATCH,PUT,DELETE',
  });

  app.use(helmet());

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  app.useWebSocketAdapter(new JwtSocketAdapter(app));

  // Swagger 설정
  const config = new DocumentBuilder()
  .setTitle('LiveForum API Docs')
  .setDescription('NestJs 기반 실시간 커뮤니티 백엔드 API 문서')
  .setVersion('1.0.0')
  .addBearerAuth( // JWT 인증 추가
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'access-token', // 이름 식별자
  )
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document) 

  await app.listen(process.env.PORT ?? 3000);
  console.log('Swagger: http://localhost:3000/api/docs');
}
bootstrap();
