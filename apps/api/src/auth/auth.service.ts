import { Injectable } from '@nestjs/common';
import { RegisterDto } from './register.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    // Verificar se o email já existe
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email já registrado');
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
        <p>Olá! ${user.id} Seu registro foi recebido e está aguardando aprovação.</p>
        <a href="http://localhost:3000/auth/verify-email?token=${token}">Clique aqui para verificar seu Email</a>
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
}