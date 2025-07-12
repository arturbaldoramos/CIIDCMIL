import { IsString, MinLength, IsArray, IsInt } from 'class-validator';

export class CreateQuestionnaireDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  description?: string;

  @IsString()
  @MinLength(3)
  city: string;

  @IsString()
  @MinLength(2)
  state: string;

  @IsString()
  @MinLength(3)
  country: string;

  @IsArray()
  @IsInt({ each: true })
  questionIds: number[];
}
