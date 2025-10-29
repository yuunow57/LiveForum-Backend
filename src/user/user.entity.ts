import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn() // pk 설정 및 자동 1 증가 
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @CreateDateColumn() // 레코드가 처음 만들어진 시각을 기록
    createAt: Date;
}