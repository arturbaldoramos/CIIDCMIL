import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateQuestionCategoryDto } from './dto/create-question-category.dto';

@Injectable()
export class QuestionCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionCategoryDto) {
    return this.prisma.questionCategory.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.questionCategory.findMany();
  }

  async findOne(id: number) {
    const questionCategory = await this.prisma.questionCategory.findUnique({
      where: { id },
    });
    if (!questionCategory) {
      throw new NotFoundException(
        `Question category with ID "${id}" not found`,
      );
    }
    return questionCategory;
  }

  async update(id: number, dto: CreateQuestionCategoryDto) {
    return this.prisma.questionCategory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.questionCategory.delete({
      where: { id },
    });
  }
}
