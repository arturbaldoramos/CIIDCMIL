import { Injectable, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) { }

  private async generateTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m', // Access token de curta duração
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d', // Refresh token de longa duração
      },
    );

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new Error('Refresh token não encontrado', { cause: { statusCode: HttpStatus.UNAUTHORIZED } });
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || !user.refreshToken) throw new Error('Acesso Negado');

      const refreshTokenMatches = await bcrypt.compare(token, user.refreshToken);
      if (!refreshTokenMatches) throw new Error('Acesso Negado');

      const tokens = await this.generateTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (e) {
      throw new Error('Refresh token inválido ou expirado', { cause: { statusCode: HttpStatus.FORBIDDEN } });
    }
  }

  async login(dto: LoginDto) {
    const { email, password } = dto

    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        emailVerified: true,
        status: true
      },
    })

    if (!user) {
      throw new Error("Credenciais inválidas", {
        cause: { statusCode: HttpStatus.UNAUTHORIZED },
      })
    }

    // Verificar se o email foi verificado
    if (!user.emailVerified) {
      throw new Error("Email não verificado. Verifique sua caixa de entrada.", {
        cause: { statusCode: HttpStatus.FORBIDDEN },
      })
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas", {
        cause: { statusCode: HttpStatus.UNAUTHORIZED },
      })
    }

    if (user.status == 'PENDING') {
      throw new Error('Sua conta ainda não foi aprovada pelo administrador', {
        cause: { statusCode: HttpStatus.FORBIDDEN }
      });
    } else if (user.status == 'SUSPENDED') {
      throw new Error('Sua conta foi suspensa. Contate o suporte.', {
        cause: { statusCode: HttpStatus.FORBIDDEN }
      });
    }

    // Gerar token JWT para autenticação
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      message: "Login realizado com sucesso",
      tokens,
    }
  }

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    // Verificar se o email já existe
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email já registrado', { cause: { statusCode: HttpStatus.CONFLICT } });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário inativo
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Gerar token de verificação com JWT
    const payload = { userId: user.id, email };
    const token = this.jwtService.sign(payload);

    // Enviar email de confirmação
    await this.mailerService.sendMail({
      to: email,
      from: this.configService.get<string>('MAILER_USER'),
      subject: 'Confirmação de Registro',

      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificação de E-mail</title>
          <style type="text/css">
          .button:hover { background-color: #1557b0; }
        </style>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #1a73e8; color: #ffffff; text-align: center; padding: 10px 0; border-radius: 8px 8px 0 0;">
              <h2>Verificação de E-mail</h2>
            </div>
            <div style="padding: 20px; text-align: center;">
              <p style="font-size: 16px; color: #333333;">Olá! ${name},</p>
              <p style="font-size: 16px; color: #333333;">Obrigado por se registrar! Seu e-mail precisa ser verificado antes que possamos prosseguir com a aprovação do seu cadastro. Clique no botão abaixo para confirmar seu endereço de e-mail:</p>
              <a href="http://localhost:5173/verify-email?token=${token}" class="button" style="display: inline-block; padding: 12px 25px; background-color: #1a73e8; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; margin-top: 20px;">Verificar E-mail Agora</a>
              <p style="font-size: 14px; color: #333333; margin-top: 20px;">Se você não solicitou este registro, por favor, ignore este e-mail.</p>
            </div>
            <div style="text-align: center; font-size: 12px; color: #777777; margin-top: 20px;">
              <p>Este é um e-mail automático. Por favor, não responda diretamente.</p>
              <p>© ${new Date().getFullYear()} CIIDCMIL. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { message: 'Usuário registrado com sucesso. Aguardando aprovação.', userId: user.id };

  }

  async verifyEmail(token: string) {
    // Verificar o token com JWT
    let payload;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new Error('Token de verificação inválido ou expirado');
    }

    const { userId, email } = payload;

    // Verificar se o usuário existe e se o e-mail ainda é o mesmo
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.email !== email) {
      throw new Error('Usuário ou e-mail inválido');
    }

    // Verificar se o e-mail já foi verificado (evita reuso do token)
    if (user.emailVerified) {
      throw new Error('E-mail já foi verificado');
    }

    // Marcar o e-mail como verificado
    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    return { userId };
  }

    async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshToken: {
          not: null,
        },
      },
      data: {
        refreshToken: null,
      },
    });
  }

}