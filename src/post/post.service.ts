import { Injectable, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { Board } from '../board/board.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PostImage } from './post-image.entity';
import { Not, In } from 'typeorm';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(PostImage)
        private readonly postImageRepository: Repository<PostImage>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    private readonly POPULAR_CACHE_KEY = 'popular_posts';

    // GET /posts
    async findAll() {

        // 캐시에서 인기글 목록 확인
        const cached = await this.cacheManager.get(this.POPULAR_CACHE_KEY);
        if (cached) {
            console.log('캐시에서 인기 게시글 가져옴');
            return cached;
        }

        // DB 조회 (조회순)
        const posts = await this.postRepository.find({
            order: { viewCount: 'DESC' },
            take: 10,
        });

        // 캐시 저장
        await this.cacheManager.set(this.POPULAR_CACHE_KEY, posts, 1000 * 60 * 5);
        console.log('인기 게시글 캐시 저장');

        return plainToInstance(Post, posts);
    }

    // GET /posts/:id
    async findOne(id: number) {
        const cacheKey = `post:${id}`;
        const cached = await this.cacheManager.get<Post>(cacheKey);
        if (cached) {
            console.log(`캐시에서 게시글 ${id} 조회`);
            return cached;
        }

        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['author', 'board'],
        });

        if (post) {
            await this.cacheManager.set(cacheKey, post, 1000 * 60 * 3);
            console.log(`게시글 ${id} 캐시 저장`);
        }

        return plainToInstance(Post, post);
    }

    // GET /posts/:id
    async updateViewCount(id: number) {
        await this.postRepository.increment({ id }, 'viewCount', 1);
        await this.cacheManager.del(`post:${id}`); // 캐시 무효화
        await this.cacheManager.del(this.POPULAR_CACHE_KEY) // 인기글 캐시 무효화
    }

    // POST /posts
    async create(dto: CreatePostDto, user: User, board: Board, files: Express.Multer.File[]) {
        const post = this.postRepository.create({
            title: dto.title,
            content: dto.content,
            author: user,
            board,
        });

        if (files && files.length > 0) {
            post.images = files.map(file => {
                return this.postImageRepository.create({
                    url: `/uploads/posts/${file.filename}`,
                });
            });
        }
        return this.postRepository.save(post);
    }

    // Patch /posts/:id
    async update(id: number, userId: number, dto: UpdatePostDto, files: Express.Multer.File[]) {
        const post = await this.findOne(id);

        if (post.author.id !== userId) throw new ForbiddenException('수정 권한이 없습니다.');

        if (dto.title !== undefined) post.title = dto.title;
        if (dto.content !== undefined) post.content = dto.content;

        const keepImageIds = dto.keepImageIds ?? [];

        if (keepImageIds.length > 0) {
            await this.postImageRepository.delete({
                post: post,
                id: Not(In(keepImageIds))
            });
        } else {
            await this.postImageRepository.delete({ post });
        }

        if (files?.length > 0) {
            const newImages = files.map(file =>
                this.postImageRepository.create({
                    url: `/uploads/posts/${file.filename}`,
                    post: post,
                }),
            );
            await this.postImageRepository.save(newImages);
        }

        return this.postRepository.save(post);
    }

    // DELETE /posts/:id
    async remove(id: number) {
        const post = await this.findOne(id);
        if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
        return this.postRepository.remove(post);
    }
}
