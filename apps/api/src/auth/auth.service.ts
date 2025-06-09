import { Injectable, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

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
      throw new Error("EMAIL_NOT_VERIFIED", {
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

    // Gerar um código de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Definir tempo de expiração (ex: 10 minutos)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Hashear o código antes de salvar no banco (IMPORTANTE!)
    const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);

    // Criar usuário inativo
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerificationCode: hashedVerificationCode,
        emailVerificationCodeExpiresAt: expiresAt,
      },
    });

    // Enviar email de confirmação
    await this.mailerService.sendMail({
      to: email,
      from: this.configService.get<string>('MAILER_USER'),
      subject: 'Seu Código de Verificação',

      html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Seu Código de Verificação</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f2f2f2; font-family: Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f2f2f2;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <tr>
                <td align="center" style="padding: 30px 30px; font-family: Arial, sans-serif;">
                  <h1 style="font-size: 28px; font-weight: bold; color: #333333; margin: 0;">Seja bem-vindo(a)!</h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 10px 30px; font-family: Arial, sans-serif;">
                  <p style="font-size: 16px; color: #666666; margin: 0;">Use o código de verificação abaixo para confirmar seu e-mail.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px 30px;">
                  <div style="background-color: #f8f8f8; border: 1px solid #dddddd; border-radius: 8px; padding: 15px 20px; display: inline-block;">
                    <p style="font-size: 32px; font-weight: bold; color: #333333; margin: 0; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">
                      ${verificationCode}
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 30px; font-family: Arial, sans-serif;">
                  <p style="font-size: 12px; color: #999999; margin: 0;">
                    Olá, ${name}! Você recebeu este e-mail porque uma verificação foi solicitada para sua conta. Caso essa solicitação não seja sua, pedimos que ignore este e-mail.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
    });

    return { message: 'Usuário registrado com sucesso. Aguardando aprovação.', userId: user.id };

  }

  async verifyEmailWithCode(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Usuário não encontrado.', { cause: { statusCode: HttpStatus.NOT_FOUND } });
    }
    if (user.emailVerified) {
      return { message: 'Este e-mail já foi verificado.' };
    }
    if (!user.emailVerificationCode || !user.emailVerificationCodeExpiresAt) {
      throw new Error('Nenhum código de verificação pendente.', { cause: { statusCode: HttpStatus.BAD_REQUEST } });
    }
    if (new Date() > user.emailVerificationCodeExpiresAt) {
      // Opcional: Limpar o código expirado
      await this.prisma.user.update({ where: { email }, data: { emailVerificationCode: null, emailVerificationCodeExpiresAt: null } });
      throw new Error('Código de verificação expirado.', { cause: { statusCode: HttpStatus.BAD_REQUEST } });
    }

    const isCodeValid = await bcrypt.compare(code, user.emailVerificationCode);

    if (!isCodeValid) {
      throw new Error('Código de verificação inválido.', { cause: { statusCode: HttpStatus.BAD_REQUEST } });
    }

    // Sucesso! Ativa o usuário e limpa os campos de verificação
    await this.prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        emailVerificationCode: null,
        emailVerificationCodeExpiresAt: null,
      },
    });

    return { message: 'E-mail verificado com sucesso. Aguardando aprovação do admin.' };
  }

  async resendVerificationCode(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Se este e-mail estiver registrado, um código foi enviado.', { cause: { statusCode: HttpStatus.OK } });
    }
    if (user.emailVerified) {
      throw new Error('Este e-mail já foi verificado.', { cause: { statusCode: HttpStatus.BAD_REQUEST } });
    }

    // Gera e salva um novo código e expiração
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // +10 minutos
    const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);

    await this.prisma.user.update({
      where: { email },
      data: {
        emailVerificationCode: hashedVerificationCode,
        emailVerificationCodeExpiresAt: expiresAt,
      },
    });

    // Reenvia o e-mail
    await this.mailerService.sendMail({
      to: email,
      subject: 'Seu Novo Código de Verificação',
      html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Seu Novo Código de Verificação</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f2f2f2; font-family: Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f2f2f2;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <tr>
                <td align="center" style="padding: 30px 30px; font-family: Arial, sans-serif;">
                  <h1 style="font-size: 28px; font-weight: bold; color: #333333; margin: 0;">Seja bem-vindo(a)!</h1>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 10px 30px; font-family: Arial, sans-serif;">
                  <p style="font-size: 16px; color: #666666; margin: 0;">Use o código de verificação abaixo para confirmar seu e-mail.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px 30px;">
                  <div style="background-color: #f8f8f8; border: 1px solid #dddddd; border-radius: 8px; padding: 15px 20px; display: inline-block;">
                    <p style="font-size: 32px; font-weight: bold; color: #333333; margin: 0; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">
                      ${verificationCode}
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 30px; font-family: Arial, sans-serif;">
                  <p style="font-size: 12px; color: #999999; margin: 0;">
                    Se você recebeu este e-mail porque uma verificação foi solicitada para sua conta. Caso essa solicitação não seja sua, pedimos que ignore este e-mail.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
    });

    return { message: 'Se um conta com este e-mail existir, um novo código foi enviado.' };
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