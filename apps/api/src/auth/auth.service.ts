import { Injectable, UnauthorizedException, ForbiddenException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private prisma: PrismaService,
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
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || !user.refreshToken) throw new ForbiddenException('Acesso Negado');

      const refreshTokenMatches = await bcrypt.compare(token, user.refreshToken);
      if (!refreshTokenMatches) throw new ForbiddenException('Acesso Negado');

      const tokens = await this.generateTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (e) {
      throw new ForbiddenException('Refresh token inválido ou expirado');
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
      throw new UnauthorizedException("Credenciais inválidas");
    }

    // Verificar se o email foi verificado
    if (!user.emailVerified) {
      throw new ForbiddenException("EMAIL_NOT_VERIFIED");
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciais inválidas")
    }

    if (user.status == 'PENDING') {
      throw new ForbiddenException('Sua conta ainda não foi aprovada pelo administrador');
    } else if (user.status == 'SUSPENDED') {
      throw new ForbiddenException('Sua conta foi suspensa. Contate o suporte.');
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
      throw new ConflictException('Email já registrado');
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

    await this.emailQueue.add(
      'send-verification-email', // Nome do job que o Processor irá ouvir
      {
        email: user.email,
        name: user.name,
        verificationCode: verificationCode, // Enviar o código não hasheado para o template
      },
      {
        attempts: 3, // Tentar reenviar 3 vezes em caso de falha
        backoff: {
          type: 'exponential',
          delay: 5000, // Esperar 5s antes da próxima tentativa
        }
      }
    );

    return { message: 'Usuário registrado com sucesso. Aguardando aprovação.', userId: user.id };

  }

  async verifyEmailWithCode(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    if (user.emailVerified) {
      return { message: 'Este e-mail já foi verificado.' };
    }
    if (!user.emailVerificationCode || !user.emailVerificationCodeExpiresAt) {
      throw new BadRequestException('Nenhum código de verificação pendente.');
    }
    if (new Date() > user.emailVerificationCodeExpiresAt) {
      await this.prisma.user.update({ where: { email }, data: { emailVerificationCode: null, emailVerificationCodeExpiresAt: null } });
      throw new BadRequestException('Código de verificação expirado.');
    }

    const isCodeValid = await bcrypt.compare(code, user.emailVerificationCode);

    if (!isCodeValid) {
      throw new BadRequestException('Código de verificação inválido.');
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
      return { message: 'Se um conta com este e-mail existir, um novo código foi enviado.' };
    }
    if (user.emailVerified) {
      throw new BadRequestException('Este e-mail já foi verificado.');
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
    await this.emailQueue.add('send-verification-email', {
      email: user.email,
      name: user.name,
      verificationCode: verificationCode,
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