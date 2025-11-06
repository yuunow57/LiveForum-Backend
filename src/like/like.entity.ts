import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Unique } from "typeorm";
import { User } from '../user/user.entity';

@Entity()
@Unique(['author', 'targetId', 'targetType'])
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    targetId: number; // Post & Comment ID

    @Column()
    targetType: 'post' | 'comment' // Like 대상 구분

    @ManyToOne(() => User, (user) => user.likes, { eager: true })
    author: User;

    @CreateDateColumn()
    createAt: Date;
}