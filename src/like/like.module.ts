import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Like } from './like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), UserModule],
  providers: [LikeService],
  controllers: [LikeController],
  exports: [LikeService]
})
export class LikeModule {}
