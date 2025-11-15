import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { Board } from './board/board.entity';
import { PostModule } from './post/post.module';
import { Post } from './post/post.entity';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/comment.entity';
import { LikeModule } from './like/like.module';
import { Like } from './like/like.entity';
import { EventsGateway } from './events/events.gateway';
import { NotificationModule } from './notification/notification.module';
import { Notification } from './notification/notification.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env 전역 선언
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Board, Post, Comment, Like, Notification],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    BoardModule,
    PostModule,
    CommentModule,
    LikeModule,
    NotificationModule,
  ],
  providers: [EventsGateway],
})
export class AppModule {}
