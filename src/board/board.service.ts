import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
    ) {}

    // Get /boards
    async findAll() {
        return this.boardRepository.find({ order: { id: 'ASC' } });
    }

    // Get /boards/:id
    async findOne(id: number) {
        const board = await this.boardRepository.findOne({ where: { id } });
        if (!board) throw new NotFoundException('게시판을 찾을 수 없습니다.'); // 404
        return board;
    }

    // Post /boards
    async create(dto: CreateBoardDto) {
        const board = this.boardRepository.create(dto);
        return this.boardRepository.save(board);
    }

    // Delete /boards/:id
    async remove(id: number) {
        const board = await this.findOne(id);
        return this.boardRepository.remove(board);
    }
}
