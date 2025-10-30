import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get() // GET /user
    getAll() {
        return this.userService.findAll();
    }

    @Post() // POST /user
    create(@Body() body: { username: string; password: string}) {
        return this.userService.create(body.username, body.password);
    }

    @Get(':id') // GET /user/:id
    getOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @Delete(':id') // DELETE /user/:id
    remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }
}
