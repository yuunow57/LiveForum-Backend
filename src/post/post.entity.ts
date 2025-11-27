import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";
import { Board } from "../board/board.entity";
import { User } from "../user/user.entity";
import { Comment } from "../comment/comment.entity";
import { PostImage } from "./post-image.entity";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ default: 0 })
    viewCount: number;

    @Exclude()
    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @ManyToOne(() => Board, (board) => board.posts, { eager: true })
    board: Board;

    @ManyToOne(() => User, (user) => user.posts, { eager: true })
    author: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @OneToMany(() => PostImage, (img) => img.post, { cascade: true })
    images: PostImage[];
}