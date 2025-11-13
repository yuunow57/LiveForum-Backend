import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { User } from '../user/user.entity';
import { LikeTargetDto } from './dto/like-target.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class LikeService {
    constructor (
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
        private readonly eventsGateway: EventsGateway,
    ) {}

    // Post /likes, 좋아요 추가/삭제 (토글)
    async toggleLike(user: User, dto: LikeTargetDto) {
        const existing = await this.likeRepository.findOne({
            where: { 
                author: { id: user.id },
                targetId: dto.targetId,
                targetType: dto.targetType
            }
        });

        if (existing) {
            await this.likeRepository.remove(existing);
        } else {
            const like = this.likeRepository.create({
                author: user,
                targetId: dto.targetId,
                targetType: dto.targetType
            });
            await this.likeRepository.save(like);
        }

        const likeCount = await this.countLikes(dto); // 좋아요 개수 함수 호출

        this.eventsGateway.emitLikeToggled(dto.targetType, dto.targetId, likeCount);

        return {
            liked: !existing,
            likeCount,
            message: existing ? '좋아요가 취소되었습니다.' : '좋아요가 추가되었습니다',
        };
    }

    // Post /likes/count, 특정 대상의 좋아요 개수 조회
    async countLikes(dto: LikeTargetDto) {
        return this.likeRepository.count({ where: {
            targetId: dto.targetId,
            targetType: dto.targetType
        } });
    }

    // 특정 유저가 좋아요 눌렀는지 여부 확인
    async isLikedByUser(user: User, dto: LikeTargetDto) {
        const existing = await this.likeRepository.findOne({
            where: {
                author: { id: user.id },
                targetId: dto.targetId,
                targetType: dto.targetType
            }
        });
        return !!existing;
    }
}
