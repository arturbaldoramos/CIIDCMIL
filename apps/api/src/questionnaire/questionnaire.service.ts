import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';

@Injectable()
export class QuestionnaireService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionnaireDto, authorId: number) {
    const { questionIds, ...questionnaireData } = dto;

    const questionnaire = await this.prisma.questionnaire.create({
      data: {
        ...questionnaireData,
        authorId: authorId,
        questions: {
          connect: questionIds.map((id) => ({ id })),
        },
      },
      include: {
        questions: true,
      },
    });
    return questionnaire;
  }

  async update(
    questionnaireId: string,
    dto: UpdateQuestionnaireDto,
    authorId: number,
  ) {
    const { questionIds, ...questionnaireData } = dto;

    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
    });

    if (!questionnaire) {
      throw new NotFoundException('Questionário não encontrado.');
    }

    if (questionnaire.authorId !== authorId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este questionário.',
      );
    }

    return this.prisma.questionnaire.update({
      where: { id: questionnaireId },
      data: {
        ...questionnaireData,
        questions: {
          set: questionIds?.map((id) => ({ id })),
        },
      },
      include: {
        questions: true,
      },
    });
  }

  async delete(questionnaireId: string, authorId: number) {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id: questionnaireId },
      select: { authorId: true },
    });

    if (!questionnaire) {
      throw new NotFoundException('Questionário não encontrado.');
    }

    if (questionnaire.authorId !== authorId) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir este questionário.',
      );
    }

    await this.prisma.questionnaire.delete({
      where: { id: questionnaireId },
    });

    return { message: 'Questionário deletado com sucesso.' };
  }

  async findAllByAuthor(authorId: number) {
    return this.prisma.questionnaire.findMany({
      where: {
        authorId: authorId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOneToAnswer(id: string) {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!questionnaire) {
      throw new NotFoundException('Questionário não encontrado.');
    }

    if (!questionnaire.isActive) {
      throw new ForbiddenException(
        'Este questionário não está aceitando respostas no momento.',
      );
    }

    return {
      id: questionnaire.id,
      title: questionnaire.title,
      description: questionnaire.description,
      questions: questionnaire.questions.map((q) => ({
        id: q.id,
        text: q.text,
        order: q.order,
      })),
    };
  }

  async findOneToEdit(id: string, authorId: number) {
    const questionnaire = await this.prisma.questionnaire.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!questionnaire) {
      throw new NotFoundException('Questionário não encontrado.');
    }

    if (questionnaire.authorId !== authorId) {
      throw new ForbiddenException(
        'Você não tem permissão para ver este questionário.',
      );
    }

    return questionnaire;
  }
}
