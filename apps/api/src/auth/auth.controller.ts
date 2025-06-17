import { Controller, Post, Body, HttpStatus, Get, HttpCode, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { VerifyEmailDto } from '@/auth/dtos/verify-email.dto';
import { Throttle } from '@nestjs/throttler';
import { RegisterDto } from '@/auth/dtos/register.dto';
import { ResendCodeDto } from '@/auth/dtos/resend-code.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) { }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
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
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    return { message: result.message, accessToken: result.tokens.accessToken };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmailWithCode(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmailWithCode(dto.email, dto.code);
  }

  @Throttle({ default: { limit: 1, ttl: 60000 } })
  @Post('resend-code')
  @HttpCode(HttpStatus.OK)
  async resendCode(@Body() dto: ResendCodeDto) {
    return this.authService.resendVerificationCode(dto.email);
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