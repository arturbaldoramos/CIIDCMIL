import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.question.findMany();
  }

  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });
    if (!question) {
      throw new NotFoundException(`Question with ID "${id}" not found`);
    }
    return question;
  }

  async update(id: number, dto: CreateQuestionDto) {
    return this.prisma.question.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.question.delete({
      where: { id },
    });
  }
}
