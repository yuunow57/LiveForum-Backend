import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToOne(() => User, (user) => user.comments, { eager: true })
    author: User;

    @ManyToOne(() => Post, (post) => post.comments, { eager: true })
    post: Post;
}