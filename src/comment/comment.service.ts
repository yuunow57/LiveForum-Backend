import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Comment } from './comment.entity';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor (
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    // Get /comments/:id
    async findAllByPost(postId: number) {
        return plainToInstance(Comment, this.commentRepository.find({ 
            where: { post: { id: postId } },
            order: { createAt: 'ASC' }
        }));
    }

    // Get /comments/detail/:id
    async findOne(id: number) {
        const comment = await this.commentRepository.findOne({ where: { id } });
        if (!comment) throw new NotFoundException('존재하지 않는 댓글 입니다.');
        return plainToInstance(Comment, comment);
    }

    // Post /comments
    async create(dto: CreateCommentDto, user: User, post: Post) {
        const comment = this.commentRepository.create({
            content: dto.content,
            author: user,
            post,
        });
        return this.commentRepository.save(comment);
    }

    // Delete /comments/:id
    async remove(id: number) {
        const comment = await this.findOne(id);
        return this.commentRepository.remove(comment);
    }
}
