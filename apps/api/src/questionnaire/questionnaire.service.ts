import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';

@Injectable()
export class QuestionnaireService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateQuestionnaireDto, authorId: number) {
        // Cria um questionário "vazio" (sem perguntas)
        const questionnaire = await this.prisma.questionnaire.create({
            data: {
                title: dto.title,
                description: dto.description,
                authorId: authorId,
            },
        });
        return questionnaire;
    }
}
