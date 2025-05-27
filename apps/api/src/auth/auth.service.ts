import { Injectable } from '@nestjs/common';
import { RegisterDto } from './register.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password } = dto;

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
        password: hashedPassword,
        role: 'USER',
        //active: false,
      },
    });

    /*await this.mailerService.sendMail({
      to: email,
      from: this.configService.get<string>('MAILER_USER'),
      subject: 'Confirmação de Registro',
      text: `Olá! Seu registro foi recebido e está aguardando aprovação. ID do usuário: ${user.id}`,
      html: `<p>Olá! Seu registro foi recebido e está aguardando aprovação. ID do usuário: ${user.id}</p>`,
    });*/

    return { message: 'Usuário registrado com sucesso. Aguardando aprovação.', userId: user.id };

  }
}