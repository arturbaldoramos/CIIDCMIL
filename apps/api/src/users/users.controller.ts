import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, ParseIntPipe} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard) // Aplica guardas a todo o controller
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    @Roles(Role.ADMIN) // Apenas admins podem listar todos os usuários
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req) {
        return this.usersService.findById(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @Roles(Role.ADMIN) // Apenas admins podem buscar usuários por ID
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Req() req) {
        return this.usersService.update(id, updateUserDto, req.user);
    }
}