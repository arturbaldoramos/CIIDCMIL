import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSubmissionDto) {
    const { questionnaireId, answers, ...submissionData } = dto;

    return this.prisma.submission.create({
      data: {
        ...submissionData,
        questionnaire: {
          connect: { id: questionnaireId },
        },
        answers: {
          create: answers.map((answer) => ({
            value: answer.value,
            question: { connect: { id: answer.questionId } },
          })),
        },
      },
      include: {
        answers: true, // Inclui as respostas na resposta da criação
      },
    });
  }

  async findAll() {
    return this.prisma.submission.findMany({
      include: {
        answers: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.submission.findUnique({
      where: { id },
      include: {
        answers: true,
      },
    });
  }
}
