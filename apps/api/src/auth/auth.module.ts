import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PrismaModule } from 'prisma/prisma.module';
@Module({
    imports: [
        PrismaModule,
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
    providers: [AuthService,],
})
export class AuthModule { }
