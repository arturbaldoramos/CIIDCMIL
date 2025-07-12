import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QuestionnaireService } from './questionnaire.service';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
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
  @Get()
  findAllByAuthor(@Req() req) {
    return this.questionnaireService.findAllByAuthor(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/edit')
  findOneToEdit(@Param('id') id: string, @Req() req) {
    return this.questionnaireService.findOneToEdit(id, req.user.userId);
  }

  @Get(':id/answer') // Rota pública para buscar o questionário para responder
  findOneToAnswer(@Param('id') id: string) {
    return this.questionnaireService.findOneToAnswer(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req) {
    return this.questionnaireService.delete(id, req.user.userId);
  }
}
