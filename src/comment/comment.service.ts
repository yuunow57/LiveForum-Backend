import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Comment } from './comment.entity';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class CommentService {
    constructor (
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        private readonly eventsGateway: EventsGateway,
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
        const saved = await this.commentRepository.save(comment);

        // WebSocket Event
        this.eventsGateway.emitCommentAdded(post.id, {
            id: saved.id,
            content: saved.content,
            author: { id: user.id, username: user.username },
            createAt: saved.createAt,
        });
        
        return plainToInstance(Comment, saved)
    }

    // Delete /comments/:id
    async remove(id: number) {
        const comment = await this.findOne(id);
        return this.commentRepository.remove(comment);
    }
}
