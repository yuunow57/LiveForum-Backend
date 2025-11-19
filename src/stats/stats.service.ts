import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';

@Injectable()
export class StatsService {
    constructor (
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    private readonly STATS_CACHE_KEY = 'stats:daily';

    // Get /stats/daily
    async getDailyStats() {
        // 캐시 데이터 확인
        const cached = await this.cacheManager.get(this.STATS_CACHE_KEY);// 레디스에 해당 키를 가진 데이터를 조회
        if (cached) { // 존재하면
            console.log(' 통계 캐시 조회')
            return cached; // 캐시 데이터가 존재하면 여기서 로직 종료
        }
        // 오늘 날짜 기준
        const start = new Date(); 
        start.setHours(0, 0, 0, 0); // start를 오늘 날짜의 0시 0분 0초 0밀리초로 초기화

        const end = new Date();
        end.setHours(23, 59, 59, 999); // end를 오늘 날짜의 23시 59분 59초 999밀리초로 초기화

        // DB 조회
        const posts = await this.postRepository.count({
            where: { createAt: Between(start, end) },
        });

        const comments = await this.commentRepository.count({
            where: { createAt: Between(start, end) },
        });

        const newUsers = await this.userRepository.count({
            where: { createAt: Between(start, end) },
        });

        const stats = {
            date: start.toISOString().slice(0, 10),
            posts,
            comments,
            newUsers,
        }

        // 캐싱
        await this.cacheManager.set(this.STATS_CACHE_KEY, stats, 1000 * 60 * 5);
        console.log('통계 캐시 생성');

        return stats;
    }

}
