import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateQuestionnaireDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  description?: string;
}