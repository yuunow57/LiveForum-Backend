import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  createUser(dto: CreateUserDto) {
    return { message: `유저 생성 완료: ${dto.username}`};
  } 
}