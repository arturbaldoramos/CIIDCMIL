import { Module } from '@nestjs/common';
import { QuestionCategoryController } from './question-category.controller';
import { QuestionCategoryService } from './question-category.service';
import { PrismaModule } from './../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [QuestionCategoryController],
  providers: [QuestionCategoryService],
})
export class QuestionCategoryModule {}
