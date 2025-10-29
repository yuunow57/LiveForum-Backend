import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getAll() {
        return this.userService.findAll();
    }

    @Post()
    create(@Body() body: { username: string; password: string}) {
        return this.userService.create(body.username, body.password);
    }

    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }
}
