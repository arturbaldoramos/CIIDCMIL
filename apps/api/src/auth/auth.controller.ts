import { Controller, Post, Body, HttpException, HttpStatus, Get, Query, HttpCode, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { Throttle } from '@nestjs/throttler';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService, // Adicionado para usar no cookie
  ) { }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const incomingRefreshToken = req.cookies.refreshToken;
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshToken(incomingRefreshToken);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // Renova o cookie por mais 7 dias
      });

      return { accessToken };
    } catch (error) {
      throw new HttpException(
        error.message || 'Acesso negado',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.login(dto);
      const { accessToken, refreshToken } = result.tokens;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });

      return { message: result.message, accessToken };
    } catch (error) {
      throw new HttpException(error.message, error.cause?.statusCode || HttpStatus.BAD_REQUEST);
    }
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const result = await this.authService.register(dto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.cause?.statusCode || HttpStatus.BAD_REQUEST);
    }
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmailWithCode(@Body() dto: VerifyEmailDto) {
    try {
      return await this.authService.verifyEmailWithCode(dto.email, dto.code);
    } catch (error) {
      throw new HttpException(error.message, error.cause?.statusCode || HttpStatus.BAD_REQUEST);
    }
  }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('resend-code')
  @HttpCode(HttpStatus.OK)
  async resendCode(@Body('email') email: string) {
    try {
      return await this.authService.resendVerificationCode(email);
    } catch (error) {
      // Mesmo em caso de erro, retornamos uma mensagem genérica para não revelar se um email existe ou não
      if (error.status !== HttpStatus.BAD_REQUEST) {
        return { message: 'Se um conta com este e-mail existir, um novo código foi enviado.' };
      }
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.userId);
    res.clearCookie('refreshToken');
    return { message: 'Logout realizado com sucesso.' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  checkAuthStatus(@Req() req) {
    return { user: req.user };
  }

}