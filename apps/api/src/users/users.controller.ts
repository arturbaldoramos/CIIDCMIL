import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req) {
        // O objeto `req.user` é populado pelo `JwtStrategy`
        // Ele contém { userId, email, role }
        return this.usersService.findById(req.user.userId);
    }
}