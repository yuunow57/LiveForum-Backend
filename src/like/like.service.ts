import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { User } from '../user/user.entity';

@Injectable()
export class LikeService {
    constructor (
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
    ) {}

    // Post /likes, 좋아요 추가/삭제 (토글)
    async toggleLike(user: User, targetId: number, targetType: 'post' | 'comment') {
        const existing = await this.likeRepository.findOne({
            where: { author: { id: user.id }, targetId, targetType }
        });

        if (existing) {
            await this.likeRepository.remove(existing);
            return { liked: false, message: '좋아요가 취소되었습니다.' };
        } else {
            const like = this.likeRepository.create({ author: user, targetId, targetType });
            await this.likeRepository.save(like)
            return { like: true, message: '좋아요가 추가되었습니다.' };
        }
    }

    // Post /likes/count, 특정 대상의 좋아요 개수 조회
    async countLikes(targetId: number, targetType: 'post' | 'comment') {
        return this.likeRepository.count({ where: { targetId, targetType } });
    }

    // 특정 유저가 좋아요 눌렀는지 여부 확인
    async isLikedByUser(user: User, targetId: number, targetType: 'post' | 'comment') {
        const existing = await this.likeRepository.findOne({
            where: { author: { id: user.id }, targetId, targetType }
        });
        return !!existing;
    }
}
