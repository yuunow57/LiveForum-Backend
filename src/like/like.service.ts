import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { User } from '../user/user.entity';
import { LikeTargetDto } from './dto/like-target.dto';
import { EventsGateway } from '../events/events.gateway';
import { NotificationService } from '../notification/notification.service';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';

@Injectable()
export class LikeService {
    constructor (
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly eventsGateway: EventsGateway,
        private readonly notificationSerivece: NotificationService,
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
        // 좋아요 알림 전송
        if (!existing) {
            if (dto.targetType === 'post') {
                const postAuthor = await this.userRepository.findOne({ where: { id: dto.targetId } });
                if (!postAuthor) throw new NotFoundException('존재하지 않는 회원 입니다.');
                await this.notificationSerivece.createNotification(
                    postAuthor,
                    'like',
                    `${user.username}님이 당신의 게시글에 좋아요를 눌렀습니다.`,
                    dto.targetId,
                );
            } else {
                const commentAuthor = await this.userRepository.findOne({ where: { id: dto.targetId } });
                if (!commentAuthor) throw new NotFoundException('존재하지 않는 회원 입니다.');
                await this.notificationSerivece.createNotification(
                    commentAuthor,
                    'like',
                    `${user.username}님이 당신의 댓글에 좋아요를 눌렀습니다.`,
                    dto.targetId,
                );
            }
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
