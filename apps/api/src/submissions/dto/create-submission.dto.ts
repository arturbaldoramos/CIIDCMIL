import {
  IsInt,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AgeRange,
  Gender,
  Income,
  FeedbackQuantity,
  FeedbackTime,
  FeedbackDevice,
} from '@prisma/client';

class AnswerDto {
  @IsInt()
  questionId: number;

  @IsInt()
  value: number;
}

export class CreateSubmissionDto {
  @IsString()
  questionnaireId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsOptional()
  @IsEnum(AgeRange)
  ageRange?: AgeRange;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(Income)
  income?: Income;

  @IsOptional()
  @IsEnum(FeedbackQuantity)
  feedbackQuantity?: FeedbackQuantity;

  @IsOptional()
  @IsEnum(FeedbackTime)
  feedbackTime?: FeedbackTime;

  @IsOptional()
  @IsEnum(FeedbackDevice)
  feedbackDevice?: FeedbackDevice;
}
