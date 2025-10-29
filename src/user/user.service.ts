import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) // Repository가 관리중인 엔티티중 User엔티티를 주입
        private userRepository: Repository<User>, // userRepository는 User테이블에 접근할 수 있는 리포지토리
                    // 리포지토리란, SQL을 직접 쓰지 않아도 데이터베이스 테이블에 접근해 CRUD를 수행하는 도우미 객체
    ) {}

    // GET /user
    findAll() {
        return this.userRepository.find();
    }

    // POST /user
    create(username: string, password: string) { 
        const user = this.userRepository.create({ username, password });
        return this.userRepository.save(user);
    }

    // GET /user/:id
    findOne(id: number) {
        return this.userRepository.findOneBy({ id });
    }
    
    // DELETE /user/:id
    remove(id: number) {
        return this.userRepository.delete({ id });
    }
}
