import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
    ) {}

    // GET /boards
    async findAll() {
        return this.boardRepository.find({ order: { id: 'ASC' } });
    }

    // GET /boards/:id
    async findOne(id: number) {
        const board = await this.boardRepository.findOne({ where: { id } });
        if (!board) throw new NotFoundException('게시판을 찾을 수 없습니다.'); // 404
        return board;
    }

    // POST /boards
    async create(dto: CreateBoardDto) {
        const board = this.boardRepository.create(dto);
        return this.boardRepository.save(board);
    }

    // Patch /boards/:id
    async update(id: number, dto:UpdateBoardDto) {
        const board = await this.findOne(id);

        if (dto.name !== undefined) board.name = dto.name;
        if (dto.description !== undefined) board.description = dto.description;

        return this.boardRepository.save(board);
    }

    // DELETE /boards/:id
    async remove(id: number) {
        const board = await this.findOne(id);
        return this.boardRepository.remove(board);
    }
}
