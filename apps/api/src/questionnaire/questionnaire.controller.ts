import { Controller, Post, Body, UseGuards, Req, Param, Get, Put, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuestionnaireService } from './questionnaire.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { CreateUpdateQuestionDto } from './dto/create-update-question.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';

@Controller('questionnaires')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateQuestionnaireDto, @Req() req) {
    // req.user é populado pelo JwtAuthGuard
    return this.questionnaireService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateQuestionnaireDto,
    @Req() req,
  ) {
    return this.questionnaireService.update(id, dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/question')
  addOrUpdateQuestion(
    @Param('id') id: string,
    @Body() questionDto: CreateUpdateQuestionDto,
    @Req() req,
  ) {
    return this.questionnaireService.addOrUpdateQuestion(id, questionDto, req.user.userId);
  }
  
  @Get(':id/answer') // Rota pública para buscar o questionário para responder
  findOneToAnswer(@Param('id') id: string) {
    return this.questionnaireService.findOneToAnswer(id);
  }
}