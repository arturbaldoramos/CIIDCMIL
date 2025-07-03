import { IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateUpdateQuestionDto {
  @IsString()
  @MinLength(5)
  text: string;

  @IsInt()
  @Min(0)
  order: number;
}