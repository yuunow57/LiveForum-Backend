import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Post } from '../post/post.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Board {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @Exclude()
    @CreateDateColumn()
    createAt: Date;

    @OneToMany(() => Post, (posts) => posts.board)
    posts: Post[];
}