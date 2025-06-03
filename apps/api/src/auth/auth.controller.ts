import { Controller, Post, Body, HttpException, HttpStatus, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const result = await this.authService.register(dto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.cause?.statusCode || HttpStatus.BAD_REQUEST);
    }
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      const verification = await this.authService.verifyEmail(token);
      return { message: 'E-mail verificado com sucesso. Aguardando aprovação do admin.', ...verification };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}