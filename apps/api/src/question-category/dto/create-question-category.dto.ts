import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateQuestionCategoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
