import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostImage } from './post-image.entity';
import { UserModule } from '../user/user.module';
import { BoardModule } from '../board/board.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/posts',
        filename: (req, file, callback) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
    TypeOrmModule.forFeature([Post, PostImage]),
    UserModule,
    BoardModule
  ], 
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
