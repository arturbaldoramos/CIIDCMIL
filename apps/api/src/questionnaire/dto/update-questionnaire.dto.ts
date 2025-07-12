import {
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
} from 'class-validator';

export class UpdateQuestionnaireDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  questionIds?: number[];
}
