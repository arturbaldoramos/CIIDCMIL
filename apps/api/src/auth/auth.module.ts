import { AuthService } from '@/auth/auth.service';
import { Module } from '@nestjs/common';
import { AuthController } from '@/auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from '@/auth/email.processor';

@Module({
    imports: [
        PrismaModule,
        BullModule.registerQueueAsync({
            name: 'email',
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get<string>('REDIS_HOST', 'localhost'),
                    port: configService.get<number>('REDIS_PORT', 6379),
                },
            }),
            inject: [ConfigService],
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '24h' }, // Token válido por 24 horas
            }),
            inject: [ConfigService],
        }),
        MailerModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get<string>('MAILER_HOST', 'smtp.gmail.com'),
                    port: configService.get<number>('MAILER_PORT', 587),
                    secure: false,
                    auth: {
                        user: configService.get<string>('MAILER_USER'),
                        pass: configService.get<string>('MAILER_PASS'),
                    },
                },
                defaults: {
                    from: '"No Reply" <no-reply@example.com>',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, EmailProcessor],
})
export class AuthModule { }
