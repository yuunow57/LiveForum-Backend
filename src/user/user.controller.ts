import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from '../auth/dto/update-user.dto';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get() // GET /user
    getAll() {
        return this.userService.findAll();
    }

    @Post() // POST /user
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Put() // PUT /user
    update(@Req() req, @Body() dto: UpdateUserDto) {
        return this.userService.update(req.user.userId, dto);
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
