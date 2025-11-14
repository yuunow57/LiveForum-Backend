import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Post } from '../post/post.entity';
import { Comment } from "../comment/comment.entity";
import { Like } from '../like/like.entity';
import { Notification } from '../notification/notification.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn() // pk 설정 및 자동 1 증가 
    id: number;

    @Column({ unique: true })
    username: string;

    @Exclude()
    @Column()
    password: string;

    @Column()
    email: string;

    @Exclude()
    @CreateDateColumn() // 레코드가 처음 만들어진 시각을 기록
    createAt: Date;

    @OneToMany(() => Post, (posts) => posts.author)
    posts: Post[];

    @OneToMany(() => Comment, (comments) => comments.author)
    comments: Comment[];

    @OneToMany(() => Like, (likes) => likes.author)
    likes: Like[];

    @OneToMany(() => Notification, (notifications) => notifications.author)
    notifications: Notification[];
}