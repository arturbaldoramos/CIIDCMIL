import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @MinLength(5)
  text: string;

  @IsInt()
  @Min(0)
  order: number;

  @IsInt()
  categoryId: number;
}
