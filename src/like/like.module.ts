import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Like } from './like.entity';
import { EventsGateway } from '../events/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), UserModule],
  providers: [LikeService, EventsGateway],
  controllers: [LikeController],
  exports: [LikeService]
})
export class LikeModule {}
