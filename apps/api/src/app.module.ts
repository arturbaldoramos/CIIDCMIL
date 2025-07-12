import { UsersModule } from './users/users.module';
import { PrismaModule } from './../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';
import { QuestionCategoryModule } from './question-category/question-category.module';
import { QuestionsModule } from './questions/questions.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 segundos
        limit: 15, // 10 requisições por minuto por IP
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    QuestionnaireModule,
    QuestionCategoryModule,
    QuestionsModule,
    SubmissionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
