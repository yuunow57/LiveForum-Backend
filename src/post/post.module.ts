import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UserModule } from '../user/user.module';
import { BoardModule } from '../board/board.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule, BoardModule], 
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
