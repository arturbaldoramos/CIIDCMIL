import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { CreateUpdateQuestionDto } from './dto/create-update-question.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';

@Injectable()
export class QuestionnaireService {
    constructor(private prisma: PrismaService) { }

    // Cria um questionário "vazio" (sem perguntas)
    async create(dto: CreateQuestionnaireDto, authorId: number) {
        const questionnaire = await this.prisma.questionnaire.create({
            data: {
                title: dto.title,
                description: dto.description,
                authorId: authorId,
            },
        });
        return questionnaire;
    }

    async update(
        questionnaireId: string,
        dto: UpdateQuestionnaireDto,
        authorId: number,
    ) {
        const questionnaire = await this.prisma.questionnaire.findUnique({
            where: { id: questionnaireId },
        });

        if (!questionnaire) {
            throw new NotFoundException('Questionário não encontrado.');
        }

        // Verificação de posse crucial
        if (questionnaire.authorId !== authorId) {
            throw new ForbiddenException('Você não tem permissão para editar este questionário.');
        }

        return this.prisma.questionnaire.update({
            where: { id: questionnaireId },
            data: dto, // Passa o DTO com os campos a serem atualizados
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
            throw new ForbiddenException('Você não tem permissão para excluir este questionário.');
        }

        //delete em cascade, deleta as perguntas associadas automaticamente
        await this.prisma.questionnaire.delete({
            where: { id: questionnaireId },
        });

        return { message: 'Questionário deletado com sucesso.' };
    }

    // Upsert: Cria a pergunta se não existir, ou atualiza se já existir com a mesma ordem.
    async addOrUpdateQuestion(
        questionnaireId: string,
        questionDto: CreateUpdateQuestionDto,
        authorId: number,
    ) {
        const questionnaire = await this.prisma.questionnaire.findUnique({
            where: { id: questionnaireId },
        });

        if (!questionnaire) {
            throw new NotFoundException('Questionário não encontrado.');
        }

        if (questionnaire.authorId !== authorId) {
            throw new ForbiddenException('Você não tem permissão para editar este questionário.');
        }
        return this.prisma.question.upsert({
            where: {
                questionnaireId_order: {
                    questionnaireId,
                    order: questionDto.order,
                },
            },
            update: {
                text: questionDto.text,
            },
            create: {
                text: questionDto.text,
                order: questionDto.order,
                questionnaireId,
            },
        });
    }

    async deleteQuestion(questionnaireId: string, questionId: number, authorId: number) {
        const questionnaire = await this.prisma.questionnaire.findUnique({
            where: { id: questionnaireId },
            select: { authorId: true },
        });

        if (!questionnaire) {
            throw new NotFoundException('Questionário não encontrado.');
        }

        if (questionnaire.authorId !== authorId) {
            throw new ForbiddenException('Você não tem permissão para editar este questionário.');
        }

        // A deleção acontece aqui. Se a pergunta não existir, o Prisma falhará silenciosamente.
        await this.prisma.question.delete({
            where: { id: questionId },
        });

        return { message: 'Pergunta deletada com sucesso.' };
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

    // Retorna um questionário para ser respondido (público)
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
            throw new ForbiddenException('Este questionário não está aceitando respostas no momento.');
        }

        // Retornamos apenas os dados necessários para a resposta, sem as respostas existentes.
        return {
            id: questionnaire.id,
            title: questionnaire.title,
            description: questionnaire.description,
            questions: questionnaire.questions.map(q => ({ id: q.id, text: q.text, order: q.order }))
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
            throw new ForbiddenException('Você não tem permissão para ver este questionário.');
        }

        return questionnaire;
    }
}
