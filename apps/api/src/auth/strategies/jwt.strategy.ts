// apps/api/src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // Extrai o token do cabeçalho 'Authorization' como um Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Garante que a validação de expiração não seja ignorada
      ignoreExpiration: false,
      // Chave secreta para verificar a assinatura do token
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  // Este método é chamado pelo Passport após o token ser verificado com sucesso
  async validate(payload: { sub: number; email: string }) {
    // Aqui, podemos buscar o usuário no banco para garantir que ele ainda existe
    // e anexar um objeto de usuário mais completo à requisição
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // O que for retornado aqui será anexado ao objeto `req.user`
    return { userId: user.id, email: user.email, role: user.role };
  }
}