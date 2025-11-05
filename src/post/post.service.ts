import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { Board } from '../board/board.entity';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {}

    // Get /posts
    async findAll() {
        return plainToInstance(Post, this.postRepository.find({ order: { createAt: 'DESC' } }));
    }

    // Get /posts/:id
    async findOne(id: number) {
        const post = await this.postRepository.findOne({ where: { id } });
        if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
        return plainToInstance(Post, post);
    }

    // Post /posts
    async create(title: string, content: string, user: User, board: Board) {
        const post = this.postRepository.create({
            title,
            content,
            author: user,
            board,
        });
        return this.postRepository.save(post);
    }

    // Delete /posts/:id
    async remove(id: number) {
        const post = await this.findOne(id);
        if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
        return this.postRepository.remove(post);
    }
}
