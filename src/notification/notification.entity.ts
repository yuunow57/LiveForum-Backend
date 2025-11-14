import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.notifications, { eager: true})
    author: User;

    @Column()
    type: 'comment' | 'like';

    @Column()
    message: string;

    @Column()
    targetId: number;

    @Column({ default: false }) // 초기값 false
    isRead: boolean;

    @CreateDateColumn()
    createAt: Date;
}