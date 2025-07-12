import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { QuestionCategoryService } from './question-category.service';
import { CreateQuestionCategoryDto } from './dto/create-question-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('question-categories')
export class QuestionCategoryController {
  constructor(
    private readonly questionCategoryService: QuestionCategoryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createQuestionCategoryDto: CreateQuestionCategoryDto) {
    return this.questionCategoryService.create(createQuestionCategoryDto);
  }

  @Get()
  findAll() {
    return this.questionCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionCategoryDto: CreateQuestionCategoryDto,
  ) {
    return this.questionCategoryService.update(id, updateQuestionCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionCategoryService.remove(id);
  }
}
