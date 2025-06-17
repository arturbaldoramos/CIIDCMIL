import { UsersModule } from '@/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          level: configService.get<string>('NODE_ENV') !== 'production' ? 'debug' : 'info',
          transport:
            configService.get<string>('NODE_ENV') !== 'production'
              ? {
                target: 'pino-pretty', // Formato legível para dev
                options: {
                  singleLine: true,
                },
              }
              : undefined, // Formato JSON para prod
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 segundos
      limit: 15,  // 10 requisições por minuto por IP
    }]),
    PrismaModule,
    AuthModule,
    UsersModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
